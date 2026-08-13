import { Inject, Injectable, Logger } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import Stripe from 'stripe'
import { CheckoutService } from 'src/checkout/checkout.service'
import { Order } from 'src/orders/order.entity'
import { OrderStatus } from 'src/orders/constants'
import { OrdersService } from 'src/orders/orders.service'
import { Payment } from 'src/payments/payment.entity'
import { DATA_SOURCE } from 'src/shared/constants'
import { WEBHOOK_EVENT_REPOSITORY } from './constants'
import { WebhookEvent } from './webhook-event.entity'

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name)

  constructor(
    @Inject(WEBHOOK_EVENT_REPOSITORY)
    private readonly webhookEventRepo: Repository<WebhookEvent>,
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    private readonly ordersService: OrdersService,
    private readonly checkoutService: CheckoutService,
  ) {}

  async processEvent(event: Stripe.Event): Promise<{
    received: true
    processed: boolean
    event: string
    orderId: number | null
  }> {
    const existing = await this.webhookEventRepo.findOne({
      where: { stripeEventId: event.id },
    })

    if (existing?.processed) {
      return {
        received: true,
        processed: true,
        event: event.type,
        orderId: existing.orderId,
      }
    }

    let record =
      existing ??
      (await this.webhookEventRepo.save(
        this.webhookEventRepo.create({
          stripeEventId: event.id,
          eventType: event.type,
          processed: false,
          processedAt: null,
          orderId: null,
          rawData: event as unknown as Record<string, unknown>,
          attempts: 0,
          lastAttemptAt: null,
          errorMessage: null,
        }),
      ))

    record.attempts += 1
    record.lastAttemptAt = new Date()
    await this.webhookEventRepo.save(record)

    try {
      const orderId = await this.dispatch(event)

      record.processed = true
      record.processedAt = new Date()
      record.orderId = orderId
      record.errorMessage = null
      await this.webhookEventRepo.save(record)

      return {
        received: true,
        processed: true,
        event: event.type,
        orderId,
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown webhook error'
      record.errorMessage = message
      await this.webhookEventRepo.save(record)
      this.logger.error(
        `Webhook ${event.type} (${event.id}) failed: ${message}`,
        error instanceof Error ? error.stack : undefined,
      )
      throw error
    }
  }

  private async dispatch(event: Stripe.Event): Promise<number | null> {
    switch (event.type) {
      case 'checkout.session.completed':
        return this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        )
      case 'checkout.session.expired':
        return this.handleCheckoutSessionExpired(
          event.data.object as Stripe.Checkout.Session,
        )
      case 'payment_intent.payment_failed':
        return this.handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent,
        )
      case 'charge.refunded':
        return this.handleChargeRefunded(event.data.object as Stripe.Charge)
      case 'payment_intent.succeeded':
      case 'charge.succeeded':
      case 'payment_method.attached':
        this.logger.log(`Ignoring informational event ${event.type}`)
        return null
      default:
        this.logger.log(`Unhandled event type ${event.type}`)
        return null
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<number | null> {
    if (session.payment_status !== 'paid') {
      this.logger.warn(
        `checkout.session.completed ${session.id} payment_status=${session.payment_status} — skipping finalize`,
      )
      return this.resolveOrderIdFromSession(session)
    }

    const orderId = this.parseOrderId(session)
    if (orderId == null) {
      this.logger.error(
        `checkout.session.completed missing orderId metadata: ${session.id}`,
      )
      return null
    }

    const order = await this.ordersService.findById(orderId)
    if (!order) {
      this.logger.error(`Order ${orderId} not found for session ${session.id}`)
      return null
    }

    const metaUserId = session.metadata?.userId
      ? Number(session.metadata.userId)
      : null
    const metaCartId = session.metadata?.cartId
      ? Number(session.metadata.cartId)
      : null

    if (metaUserId != null && metaUserId !== order.userId) {
      this.logger.error(
        `Session ${session.id} userId mismatch for order ${orderId}`,
      )
      return orderId
    }
    if (
      metaCartId != null &&
      order.cartId != null &&
      metaCartId !== order.cartId
    ) {
      this.logger.error(
        `Session ${session.id} cartId mismatch for order ${orderId}`,
      )
      return orderId
    }

    if (order.status === OrderStatus.PROCESSING) {
      return orderId
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent?.id ?? null)

    await this.checkoutService.finalizePaid(orderId, {
      stripePaymentIntentId: paymentIntentId,
      paymentMethod: 'card',
    })

    return orderId
  }

  private async handleCheckoutSessionExpired(
    session: Stripe.Checkout.Session,
  ): Promise<number | null> {
    const orderId = this.parseOrderId(session)
    if (orderId == null) return null

    await this.checkoutService.cancelPending(orderId, {
      reason: 'Stripe checkout session expired',
      markExpired: true,
    })
    return orderId
  }

  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<number | null> {
    const orderId = paymentIntent.metadata?.orderId
      ? Number(paymentIntent.metadata.orderId)
      : null

    if (orderId == null || Number.isNaN(orderId)) {
      return null
    }

    const order = await this.ordersService.findById(orderId)
    if (!order || order.status !== OrderStatus.PENDING) {
      return orderId
    }

    const failureMessage =
      paymentIntent.last_payment_error?.message ?? 'Payment failed'

    await this.checkoutService.cancelPending(orderId, {
      reason: failureMessage,
    })
    return orderId
  }

  private async handleChargeRefunded(
    charge: Stripe.Charge,
  ): Promise<number | null> {
    const paymentIntentId =
      typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : (charge.payment_intent?.id ?? null)

    if (!paymentIntentId) return null

    const order = await this.dataSource.getRepository(Order).findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    })

    if (order) {
      await this.checkoutService.markRefunded(
        order.id,
        charge.amount_refunded ?? 0,
      )
      return order.id
    }

    const payment = await this.dataSource.getRepository(Payment).findOne({
      where: { stripePaymentIntentId: paymentIntentId },
    })
    if (!payment) return null

    await this.checkoutService.markRefunded(
      payment.orderId,
      charge.amount_refunded ?? 0,
    )
    return payment.orderId
  }

  private parseOrderId(session: Stripe.Checkout.Session): number | null {
    const fromMeta = session.metadata?.orderId
      ? Number(session.metadata.orderId)
      : null
    if (fromMeta != null && !Number.isNaN(fromMeta)) return fromMeta

    const fromRef = session.client_reference_id
      ? Number(session.client_reference_id)
      : null
    if (fromRef != null && !Number.isNaN(fromRef)) return fromRef

    return null
  }

  private async resolveOrderIdFromSession(
    session: Stripe.Checkout.Session,
  ): Promise<number | null> {
    const parsed = this.parseOrderId(session)
    if (parsed != null) return parsed
    if (session.id) {
      const order = await this.ordersService.findByStripeSessionId(session.id)
      return order?.id ?? null
    }
    return null
  }
}
