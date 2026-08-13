import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { DataSource, EntityManager, In, Repository } from 'typeorm'
import { Address } from 'src/addresses/address.entity'
import { Cart } from 'src/carts/cart.entity'
import { CartItem } from 'src/carts/cart-item.entity'
import { CartStatus } from 'src/carts/constants'
import {
  OrderStatus,
  type OrderAddressSnapshot,
  type OrderProductSnapshot,
} from 'src/orders/constants'
import { Order } from 'src/orders/order.entity'
import { OrderItem } from 'src/orders/order-item.entity'
import { Payment } from 'src/payments/payment.entity'
import { PaymentStatus } from 'src/payments/constants'
import { ProductVariant } from 'src/product-variants/product-variant.entity'
import { VariantStatus } from 'src/product-variants/constants'
import { PublicationStatus } from 'src/products/constants'
import {
  ReservationStatus,
  ReservationType,
  RESERVATION_TTL_MINUTES,
  INVENTORY_RESERVATION_REPOSITORY,
} from 'src/reservations/constants'
import { InventoryReservation } from 'src/reservations/inventory-reservation.entity'
import { DATA_SOURCE } from 'src/shared/constants'
import { NotificationsService } from 'src/notifications/notifications.service'
import { User } from 'src/users/user.entity'

export type BeginCheckoutResult = {
  order: Order
  items: OrderItem[]
  payment: Payment
  cart: Cart
}

/**
 * Single orchestration point for pre/post checkout.
 * All multi-entity mutations run inside one transaction here —
 * callers never pass EntityManager around.
 */
@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name)

  constructor(
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(INVENTORY_RESERVATION_REPOSITORY)
    private readonly reservationRepo: Repository<InventoryReservation>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** Pre-payment: pending order + payment + reservations + lock cart. */
  async beginCheckout(
    userId: number,
    input: { cartId: number; addressId: number },
  ): Promise<BeginCheckoutResult> {
    return this.dataSource.transaction((manager) =>
      this.runBeginCheckout(manager, userId, input),
    )
  }

  /** Post-payment success. */
  async finalizePaid(
    orderId: number,
    options?: {
      stripePaymentIntentId?: string | null
      stripeChargeId?: string | null
      paymentMethod?: string | null
    },
  ): Promise<Order> {
    const order = await this.dataSource.transaction((manager) =>
      this.runFinalizePaid(manager, orderId, options),
    )

    // After TX commit — never fail payment finalize if Slack is down.
    try {
      await this.notificationsService.sendOrderConfirmation(order)
    } catch (error) {
      this.logger.error(
        `Order confirmation notification failed for order ${order.id}`,
        error instanceof Error ? error.stack : String(error),
      )
    }

    return order
  }

  /** Cancel / expire / payment failure while still pending. */
  async cancelPending(
    orderId: number,
    options?: {
      reason?: string
      markExpired?: boolean
      userId?: number
    },
  ): Promise<Order> {
    return this.dataSource.transaction((manager) =>
      this.runCancelPending(manager, orderId, options),
    )
  }

  async attachStripeSession(orderId: number, sessionId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Order).update(orderId, {
        stripeCheckoutSessionId: sessionId,
      })
      await manager.getRepository(Payment).update(
        { orderId, status: PaymentStatus.PENDING },
        { stripeCheckoutSessionId: sessionId },
      )
    })
  }

  async markRefunded(orderId: number, refundedAmount: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const order = await this.lockOrder(manager, orderId)
      if (
        order.status !== OrderStatus.PROCESSING &&
        order.status !== OrderStatus.SHIPPED &&
        order.status !== OrderStatus.DELIVERED &&
        order.status !== OrderStatus.REFUNDED
      ) {
        return
      }

      const paymentRepo = manager.getRepository(Payment)
      const payment = await paymentRepo.findOne({
        where: { orderId },
        order: { id: 'DESC' },
      })
      if (payment) {
        payment.refundedAmount = Math.max(
          payment.refundedAmount,
          refundedAmount,
        )
        if (payment.refundedAmount >= payment.amount) {
          payment.status = PaymentStatus.REFUNDED
          order.status = OrderStatus.REFUNDED
        }
        await paymentRepo.save(payment)
      } else {
        order.status = OrderStatus.REFUNDED
      }
      await manager.getRepository(Order).save(order)
    })
  }

  /** Release leftover active reservations for non-pending orders (sweeper). */
  async releaseStaleReservations(
    orderId: number,
    markExpired = true,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await this.releaseReservations(manager, orderId, { markExpired })
    })
  }

  async hasActiveReservations(orderId: number): Promise<boolean> {
    const count = await this.reservationRepo.count({
      where: { orderId, status: ReservationStatus.ACTIVE },
    })
    return count > 0
  }

  // ─── private transaction bodies ─────────────────────────────────────────

  private async runBeginCheckout(
    manager: EntityManager,
    userId: number,
    input: { cartId: number; addressId: number },
  ): Promise<BeginCheckoutResult> {
    const cartRepo = manager.getRepository(Cart)
    const cartItemRepo = manager.getRepository(CartItem)
    const variantRepo = manager.getRepository(ProductVariant)
    const addressRepo = manager.getRepository(Address)
    const orderRepo = manager.getRepository(Order)
    const itemRepo = manager.getRepository(OrderItem)
    const paymentRepo = manager.getRepository(Payment)

    const existingPending = await orderRepo.findOne({
      where: {
        userId,
        cartId: input.cartId,
        status: OrderStatus.PENDING,
      },
      order: { id: 'DESC' },
    })

    if (existingPending) {
      const hasActive = await this.countActiveReservations(
        manager,
        existingPending.id,
      )
      if (hasActive > 0) {
        const items = await itemRepo.find({
          where: { orderId: existingPending.id },
        })
        const payment = await paymentRepo.findOne({
          where: { orderId: existingPending.id },
          order: { id: 'DESC' },
        })
        const cart = await cartRepo.findOne({
          where: { id: input.cartId, userId },
          relations: { items: { variant: { product: true } } },
        })
        if (cart && payment) {
          return { order: existingPending, items, payment, cart }
        }
      } else {
        await this.runCancelPending(manager, existingPending.id, {
          reason: 'Stale pending checkout replaced',
          markExpired: true,
        })
      }
    }

    const cart = await cartRepo
      .createQueryBuilder('cart')
      .setLock('pessimistic_write')
      .where('cart.id = :cartId', { cartId: input.cartId })
      .andWhere('cart.userId = :userId', { userId })
      .getOne()

    if (!cart) throw new NotFoundException('Cart not found')

    if (cart.status === CartStatus.CHECKOUT_IN_PROGRESS) {
      cart.status = CartStatus.ACTIVE
      cart.pendingCheckoutOrderId = null
      await cartRepo.save(cart)
    }
    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cart is not available for checkout')
    }

    const cartItems = await cartItemRepo.find({ where: { cartId: cart.id } })
    if (!cartItems.length) throw new BadRequestException('Cart is empty')

    const variantIds = [...new Set(cartItems.map((item) => item.variantId))]
    const withProducts = await variantRepo.find({
      where: { id: In(variantIds) },
      relations: { product: true },
    })
    const variantMap = new Map(withProducts.map((v) => [v.id, v]))
    for (const item of cartItems) {
      const variant = variantMap.get(item.variantId)
      if (
        !variant ||
        variant.deletedAt ||
        variant.status !== VariantStatus.ACTIVE ||
        !variant.product ||
        variant.product.deletedAt ||
        variant.product.publicationStatus !== PublicationStatus.PUBLISHED
      ) {
        throw new BadRequestException(
          `Variant ${item.variantId} is not available for purchase`,
        )
      }
      // Soft availability check only — authoritative reserve happens under row locks.
      const available = variant.stockOnHand - variant.reservedStock
      if (item.quantity > available) {
        throw new ConflictException(
          `Only ${Math.max(0, available)} unit(s) available for ${variant.sku}`,
        )
      }
    }

    const address = await addressRepo
      .createQueryBuilder('address')
      .setLock('pessimistic_write')
      .where('address.id = :id', { id: input.addressId })
      .andWhere('address.userId = :userId', { userId })
      .getOne()
    if (!address) throw new NotFoundException('Address not found')

    const totalAmount = cartItems.reduce((sum, item) => {
      const variant = variantMap.get(item.variantId)!
      return sum + variant.price * item.quantity
    }, 0)
    const shippingAddress = this.toAddressSnapshot(address)

    let order = await orderRepo.save(
      orderRepo.create({
        orderNumber: `TMP-${userId}-${Date.now()}`,
        userId,
        cartId: cart.id,
        status: OrderStatus.PENDING,
        totalAmount,
        currency: 'usd',
        shippingAddress,
        billingAddress: shippingAddress,
      }),
    )
    order.orderNumber = `VG-${String(order.id).padStart(6, '0')}`
    order = await orderRepo.save(order)

    const items: OrderItem[] = []
    for (const item of cartItems) {
      const variant = variantMap.get(item.variantId)!
      const snapshot: OrderProductSnapshot = {
        productId: variant.productId,
        variantId: variant.id,
        name: variant.product?.name ?? 'Product',
        sku: variant.sku,
        imageUrl: variant.media?.url ?? null,
        attributes: variant.attributes,
      }
      items.push(
        await itemRepo.save(
          itemRepo.create({
            orderId: order.id,
            productId: variant.productId,
            variantId: variant.id,
            quantity: item.quantity,
            unitPrice: variant.price,
            totalPrice: variant.price * item.quantity,
            productSnapshot: snapshot,
          }),
        ),
      )
    }

    const payment = await paymentRepo.save(
      paymentRepo.create({
        orderId: order.id,
        amount: totalAmount,
        currency: 'usd',
        status: PaymentStatus.PENDING,
        paymentMethod: null,
        paidAt: null,
        refundedAmount: 0,
        failureMessage: null,
        stripeCheckoutSessionId: null,
        stripePaymentIntentId: null,
        stripeChargeId: null,
      }),
    )

    await this.reserveStock(manager, {
      orderId: order.id,
      cartId: cart.id,
      cartItems,
      variantMap,
    })

    cart.status = CartStatus.CHECKOUT_IN_PROGRESS
    cart.pendingCheckoutOrderId = order.id
    await cartRepo.save(cart)

    const cartWithItems = await cartRepo.findOne({
      where: { id: cart.id },
      relations: { items: { variant: { product: true } } },
    })

    return {
      order,
      items,
      payment,
      cart: cartWithItems ?? cart,
    }
  }

  private async runFinalizePaid(
    manager: EntityManager,
    orderId: number,
    options?: {
      stripePaymentIntentId?: string | null
      stripeChargeId?: string | null
      paymentMethod?: string | null
    },
  ): Promise<Order> {
    const order = await this.lockOrder(manager, orderId)

    if (order.status === OrderStatus.PROCESSING) return order
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order cannot be finalized from status ${order.status}`,
      )
    }

    await this.fulfillReservations(manager, order.id)

    const paymentRepo = manager.getRepository(Payment)
    const payment =
      (await paymentRepo.findOne({
        where: { orderId: order.id, status: PaymentStatus.PENDING },
        order: { id: 'DESC' },
      })) ??
      (await paymentRepo.findOne({
        where: { orderId: order.id },
        order: { id: 'DESC' },
      }))

    if (payment) {
      payment.status = PaymentStatus.SUCCEEDED
      payment.paidAt = new Date()
      payment.failureMessage = null
      if (options?.stripePaymentIntentId) {
        payment.stripePaymentIntentId = options.stripePaymentIntentId
      }
      if (options?.stripeChargeId) {
        payment.stripeChargeId = options.stripeChargeId
      }
      if (options?.paymentMethod) {
        payment.paymentMethod = options.paymentMethod
      }
      await paymentRepo.save(payment)
    }

    order.status = OrderStatus.PROCESSING
    if (options?.stripePaymentIntentId) {
      order.stripePaymentIntentId = options.stripePaymentIntentId
    }
    await manager.getRepository(Order).save(order)

    if (order.cartId != null) {
      const cartRepo = manager.getRepository(Cart)
      const cart = await cartRepo
        .createQueryBuilder('cart')
        .setLock('pessimistic_write')
        .where('cart.id = :cartId', { cartId: order.cartId })
        .getOne()
      if (cart && cart.status === CartStatus.CHECKOUT_IN_PROGRESS) {
        cart.status = CartStatus.CONVERTED
        cart.convertedOrderId = order.id
        cart.pendingCheckoutOrderId = null
        await cartRepo.save(cart)
      }
    }

    return order
  }

  private async runCancelPending(
    manager: EntityManager,
    orderId: number,
    options?: {
      reason?: string
      markExpired?: boolean
      userId?: number
    },
  ): Promise<Order> {
    const order = await this.lockOrder(manager, orderId)

    if (options?.userId != null && order.userId !== options.userId) {
      throw new NotFoundException('Order not found')
    }

    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.PROCESSING ||
      order.status === OrderStatus.REFUNDED
    ) {
      return order
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order cannot be cancelled from status ${order.status}`,
      )
    }

    await this.releaseReservations(manager, order.id, {
      markExpired: options?.markExpired,
    })

    await manager.getRepository(Payment).update(
      { orderId: order.id, status: PaymentStatus.PENDING },
      {
        status: options?.markExpired
          ? PaymentStatus.CANCELLED
          : PaymentStatus.FAILED,
        failureMessage: options?.reason ?? null,
      },
    )

    order.status = OrderStatus.CANCELLED
    await manager.getRepository(Order).save(order)

    if (order.cartId != null) {
      const cartRepo = manager.getRepository(Cart)
      const cart = await cartRepo
        .createQueryBuilder('cart')
        .setLock('pessimistic_write')
        .where('cart.id = :cartId', { cartId: order.cartId })
        .getOne()
      if (cart && cart.status === CartStatus.CHECKOUT_IN_PROGRESS) {
        cart.status = CartStatus.ACTIVE
        cart.pendingCheckoutOrderId = null
        await cartRepo.save(cart)
      }
    }

    return order
  }

  // ─── inventory helpers (same class — no cross-service manager) ──────────

  private async reserveStock(
    manager: EntityManager,
    params: {
      orderId: number
      cartId: number
      cartItems: CartItem[]
      variantMap: Map<number, ProductVariant>
    },
  ): Promise<void> {
    const reservationRepo = manager.getRepository(InventoryReservation)
    const variantRepo = manager.getRepository(ProductVariant)
    const expiresAt = new Date(Date.now() + RESERVATION_TTL_MINUTES * 60_000)

    // Lock variants alone (no joins — Postgres rejects FOR UPDATE on outer joins).
    // Sort ids so concurrent checkouts acquire locks in the same order.
    const variantIds = [
      ...new Set(params.cartItems.map((item) => item.variantId)),
    ].sort((a, b) => a - b)

    const lockedVariants = await variantRepo
      .createQueryBuilder('variant')
      .setLock('pessimistic_write')
      .where('variant.id IN (:...variantIds)', { variantIds })
      .getMany()
    const lockedMap = new Map(lockedVariants.map((v) => [v.id, v]))

    for (const item of params.cartItems) {
      const variant = lockedMap.get(item.variantId)
      if (!variant || variant.deletedAt) {
        throw new BadRequestException(
          `Variant ${item.variantId} is not available for purchase`,
        )
      }

      const available = Math.max(0, variant.stockOnHand - variant.reservedStock)
      if (item.quantity > available) {
        throw new ConflictException(
          `Only ${available} unit(s) available for ${variant.sku}`,
        )
      }

      variant.reservedStock += item.quantity
      await variantRepo.save(variant)

      // Keep caller's map in sync for any later use in this TX.
      const mapped = params.variantMap.get(item.variantId)
      if (mapped) {
        mapped.reservedStock = variant.reservedStock
      }

      await reservationRepo.save(
        reservationRepo.create({
          orderId: params.orderId,
          cartId: params.cartId,
          variantId: variant.id,
          productId: variant.productId,
          quantity: item.quantity,
          expiresAt,
          status: ReservationStatus.ACTIVE,
          reservationType: ReservationType.CHECKOUT,
        }),
      )
    }
  }

  private async fulfillReservations(
    manager: EntityManager,
    orderId: number,
  ): Promise<void> {
    const reservationRepo = manager.getRepository(InventoryReservation)
    const variantRepo = manager.getRepository(ProductVariant)

    const reservations = await reservationRepo.find({
      where: { orderId, status: ReservationStatus.ACTIVE },
    })
    if (!reservations.length) return

    const variantIds = [...new Set(reservations.map((r) => r.variantId))]
    const lockedVariants = await variantRepo
      .createQueryBuilder('variant')
      .setLock('pessimistic_write')
      .where('variant.id IN (:...variantIds)', { variantIds })
      .getMany()
    const variantMap = new Map(lockedVariants.map((v) => [v.id, v]))

    for (const reservation of reservations) {
      const variant = variantMap.get(reservation.variantId)
      if (!variant) {
        throw new BadRequestException(
          `Variant ${reservation.variantId} missing while fulfilling reservation`,
        )
      }
      if (variant.reservedStock < reservation.quantity) {
        throw new BadRequestException(
          `Insufficient reserved stock for ${variant.sku}`,
        )
      }
      if (variant.stockOnHand < reservation.quantity) {
        throw new BadRequestException(
          `Insufficient on-hand stock for ${variant.sku}`,
        )
      }

      variant.reservedStock -= reservation.quantity
      variant.stockOnHand -= reservation.quantity
      await variantRepo.save(variant)

      reservation.status = ReservationStatus.FULFILLED
      await reservationRepo.save(reservation)
    }
  }

  private async releaseReservations(
    manager: EntityManager,
    orderId: number,
    options?: { markExpired?: boolean },
  ): Promise<void> {
    const reservationRepo = manager.getRepository(InventoryReservation)
    const variantRepo = manager.getRepository(ProductVariant)

    const reservations = await reservationRepo.find({
      where: { orderId, status: ReservationStatus.ACTIVE },
    })
    if (!reservations.length) return

    const variantIds = [...new Set(reservations.map((r) => r.variantId))]
    const lockedVariants = await variantRepo
      .createQueryBuilder('variant')
      .setLock('pessimistic_write')
      .where('variant.id IN (:...variantIds)', { variantIds })
      .getMany()
    const variantMap = new Map(lockedVariants.map((v) => [v.id, v]))

    const nextStatus = options?.markExpired
      ? ReservationStatus.EXPIRED
      : ReservationStatus.RELEASED

    for (const reservation of reservations) {
      const variant = variantMap.get(reservation.variantId)
      if (variant) {
        variant.reservedStock = Math.max(
          0,
          variant.reservedStock - reservation.quantity,
        )
        await variantRepo.save(variant)
      }
      reservation.status = nextStatus
      await reservationRepo.save(reservation)
    }
  }

  private async countActiveReservations(
    manager: EntityManager,
    orderId: number,
  ): Promise<number> {
    return manager.getRepository(InventoryReservation).count({
      where: { orderId, status: ReservationStatus.ACTIVE },
    })
  }

  private async lockOrder(
    manager: EntityManager,
    orderId: number,
  ): Promise<Order> {
    // Lock order alone — Postgres rejects FOR UPDATE with LEFT JOIN
    // ("nullable side of an outer join").
    const order = await manager
      .getRepository(Order)
      .createQueryBuilder('ord')
      .setLock('pessimistic_write')
      .where('ord.id = :orderId', { orderId })
      .getOne()

    if (!order) throw new NotFoundException('Order not found')

    order.items = await manager.getRepository(OrderItem).find({
      where: { orderId: order.id },
    })

    const user = await manager.getRepository(User).findOne({
      where: { id: order.userId },
    })
    if (user) {
      order.user = user
    }

    return order
  }

  private toAddressSnapshot(address: Address): OrderAddressSnapshot {
    return {
      recipientName: address.recipientName,
      email: address.email,
      phone: address.phone,
      line1: address.line1,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    }
  }
}
