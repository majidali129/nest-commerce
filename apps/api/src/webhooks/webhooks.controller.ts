import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common'
import type { RawBodyRequest } from '@nestjs/common'
import type { Request } from 'express'
import Stripe from 'stripe'
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator'
import { WebhooksService } from './webhooks.service'

@Controller()
export class WebhooksController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-07-29.dahlia',
  })

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Webhook received successfully')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const rawBody = req.rawBody
    if (!rawBody || !sig) {
      throw new BadRequestException('Missing webhook body or signature')
    }

    let event: Stripe.Event
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      )
    } catch (error) {
      console.error('Error verifying Stripe webhook signature', error)
      throw new BadRequestException('Invalid Stripe webhook signature')
    }

    return this.webhooksService.processEvent(event)
  }
}
