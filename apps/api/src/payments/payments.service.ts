import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import type { CreateCheckoutSessionReturnType } from '@repo/contracts'
import Stripe from 'stripe'
import { Cart } from 'src/carts/cart.entity'
import { CheckoutService } from 'src/checkout/checkout.service'
import { RESERVATION_TTL_MINUTES } from 'src/reservations/constants'
import type { AuthUser } from 'src/shared/types/auth-user'
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto'

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-07-29.dahlia',
  })

  constructor(private readonly checkoutService: CheckoutService) {}

  async createSession(
    user: AuthUser,
    dto: CreateCheckoutSessionDto,
  ): Promise<CreateCheckoutSessionReturnType> {
    const pending = await this.checkoutService.beginCheckout(user.id, {
      cartId: dto.cartId,
      addressId: dto.addressId,
    })
    console.log('Pending order', pending);

    if (pending.order.stripeCheckoutSessionId) {
      try {
        console.log('Retrieving existing checkout session for order', pending.order.id);
        const existing = await this.stripe.checkout.sessions.retrieve(
          pending.order.stripeCheckoutSessionId,
        )
        if (
          existing.status === 'open' &&
          existing.url &&
          existing.expires_at * 1000 > Date.now()
        ) {
          return {
            url: existing.url,
            sessionId: existing.id,
            clientSecret: existing.client_secret,
            orderId: pending.order.id,
          }
        }
      } catch {
        // Session gone — create a new one below.
      }
    }

    const cart = pending.cart
    if (!cart.items?.length) {
      throw new BadRequestException('Cart is empty')
    }

    const expiresAt =
      Math.floor(Date.now() / 1000) + RESERVATION_TTL_MINUTES * 60

    let session: Stripe.Checkout.Session
    console.log('Creating Stripe checkout session for order', pending.order.id);
    try {
      session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: this.createLineItems(cart),
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel?order_id=${pending.order.id}`,
        client_reference_id: String(pending.order.id),
        expires_at: expiresAt,
        metadata: {
          orderId: String(pending.order.id),
          userId: String(user.id),
          cartId: String(cart.id),
        },
        customer_creation: 'always',
      })
    } catch (error) {
      await this.checkoutService.cancelPending(pending.order.id, {
        reason: 'Failed to create Stripe checkout session',
      })
      throw error
    }

    await this.checkoutService.attachStripeSession(
      pending.order.id,
      session.id,
    )

    return {
      url: session.url,
      sessionId: session.id,
      clientSecret: session.client_secret,
      orderId: pending.order.id,
    }
  }

  private createLineItems(
    cart: Cart,
  ): Stripe.Checkout.SessionCreateParams.LineItem[] {
    return (cart.items ?? []).map((item) => {
      const product = item.variant?.product
      if (!item.variant || !product) {
        throw new NotFoundException('Cart item variant is missing product data')
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.shortDescription || undefined,
            images: item.variant.media?.url ? [item.variant.media.url] : [],
          },
          unit_amount: item.variant.price,
        },
        quantity: item.quantity,
      }
    })
  }
}
