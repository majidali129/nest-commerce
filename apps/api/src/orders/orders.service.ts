import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import type {
  AdminOrderListItem,
  AdminOrdersReturnType,
  OrderItemReturnType,
  OrderListItem,
  OrderReturnType,
  OrdersReturnType,
  PaymentReturnType,
} from '@repo/contracts'
import { Repository } from 'typeorm'
import { CheckoutService } from 'src/checkout/checkout.service'
import { Payment } from 'src/payments/payment.entity'
import { PAYMENT_REPOSITORY } from 'src/payments/constants'
import { ORDER_REPOSITORY, OrderStatus } from './constants'
import { Order } from './order.entity'

const ADMIN_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [
    OrderStatus.SHIPPED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
  [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUNDED]: [],
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: Repository<Order>,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: Repository<Payment>,
    private readonly checkoutService: CheckoutService,
  ) {}

  async listForUser(userId: number): Promise<OrdersReturnType> {
    const orders = await this.orderRepo.find({
      where: { userId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    })
    return {
      items: orders.map((order) => this.toListItem(order)),
    }
  }

  async listAllAdmin(): Promise<AdminOrdersReturnType> {
    const orders = await this.orderRepo.find({
      relations: { items: true, user: true },
      order: { createdAt: 'DESC' },
    })
    return {
      items: orders.map((order) => this.toAdminListItem(order)),
    }
  }

  async getForUser(userId: number, orderId: number): Promise<OrderReturnType> {
    const order = await this.findOwnedOrder(userId, orderId)
    return this.toOrderReturn(order, await this.findPayment(order.id))
  }

  async getByIdAdmin(orderId: number): Promise<OrderReturnType> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: { items: true, user: true },
    })
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    return this.toOrderReturn(order, await this.findPayment(order.id))
  }

  async getByStripeSessionId(
    userId: number,
    sessionId: string,
  ): Promise<OrderReturnType> {
    const order = await this.orderRepo.findOne({
      where: { userId, stripeCheckoutSessionId: sessionId },
      relations: { items: true },
    })
    if (!order) {
      throw new NotFoundException('Order not found for this session')
    }
    return this.toOrderReturn(order, await this.findPayment(order.id))
  }

  async updateStatusAdmin(
    orderId: number,
    status: OrderStatus,
  ): Promise<OrderReturnType> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: { items: true },
    })
    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.status === status) {
      return this.toOrderReturn(order, await this.findPayment(order.id))
    }

    const allowed = ADMIN_STATUS_TRANSITIONS[order.status] ?? []
    if (!allowed.includes(status)) {
      throw new BadRequestException(
        `Cannot change order status from ${order.status} to ${status}`,
      )
    }

    // Pending cancel must release reservations / reopen cart.
    if (
      order.status === OrderStatus.PENDING &&
      status === OrderStatus.CANCELLED
    ) {
      await this.checkoutService.cancelPending(orderId, {
        reason: 'Cancelled by admin',
      })
      return this.getByIdAdmin(orderId)
    }

    order.status = status
    await this.orderRepo.save(order)
    return this.toOrderReturn(order, await this.findPayment(order.id))
  }

  async cancelCheckoutForUser(
    userId: number,
    orderId: number,
  ): Promise<OrderReturnType> {
    await this.checkoutService.cancelPending(orderId, {
      userId,
      reason: 'Cancelled by user',
    })
    return this.getForUser(userId, orderId)
  }

  async findById(orderId: number): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { id: orderId },
      relations: { items: true },
    })
  }

  async findByStripeSessionId(sessionId: string): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { stripeCheckoutSessionId: sessionId },
      relations: { items: true },
    })
  }

  private async findPayment(orderId: number): Promise<Payment | null> {
    return this.paymentRepo.findOne({
      where: { orderId },
      order: { id: 'DESC' },
    })
  }

  private async findOwnedOrder(userId: number, orderId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, userId },
      relations: { items: true },
    })
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    return order
  }

  private itemCount(order: Order): number {
    return (order.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
  }

  private previewImageUrl(order: Order): string | null {
    const first = order.items?.[0]
    return first?.productSnapshot?.imageUrl ?? null
  }

  private toListItem(order: Order): OrderListItem {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as OrderListItem['status'],
      totalAmount: order.totalAmount,
      currency: order.currency,
      createdAt: order.createdAt.toISOString(),
      itemCount: this.itemCount(order),
      previewImageUrl: this.previewImageUrl(order),
    }
  }

  private toAdminListItem(order: Order): AdminOrderListItem {
    return {
      ...this.toListItem(order),
      userId: order.userId,
      customerName:
        order.shippingAddress?.recipientName ?? order.user?.name ?? 'Customer',
      customerEmail:
        order.shippingAddress?.email ?? order.user?.email ?? '',
    }
  }

  private toOrderReturn(
    order: Order,
    payment?: Payment | null,
  ): OrderReturnType {
    const items: OrderItemReturnType[] = (order.items ?? []).map((item) => ({
      id: item.id,
      variantId: item.variantId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      productSnapshot: item.productSnapshot,
    }))

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as OrderReturnType['status'],
      totalAmount: order.totalAmount,
      currency: order.currency,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      items,
      payment: payment ? this.toPaymentReturn(payment) : null,
      stripeCheckoutSessionId: order.stripeCheckoutSessionId,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }
  }

  private toPaymentReturn(payment: Payment): PaymentReturnType {
    return {
      id: payment.id,
      orderId: payment.orderId,
      stripeCheckoutSessionId: payment.stripeCheckoutSessionId,
      stripePaymentIntentId: payment.stripePaymentIntentId,
      stripeChargeId: payment.stripeChargeId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status as PaymentReturnType['status'],
      paymentMethod: payment.paymentMethod,
      failureMessage: payment.failureMessage,
      createdAt: payment.createdAt.toISOString(),
      paidAt: payment.paidAt?.toISOString() ?? null,
      refundedAmount: payment.refundedAmount,
    }
  }
}
