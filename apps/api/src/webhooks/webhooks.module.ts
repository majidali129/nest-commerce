import { Module } from '@nestjs/common'
import { CheckoutModule } from 'src/checkout/checkout.module'
import { DatabasesModule } from 'src/database/databases.module'
import { OrdersModule } from 'src/orders/orders.module'
import { WEBHOOK_EVENT_PROVIDER } from './webhook-event.provider'
import { WebhooksController } from './webhooks.controller'
import { WebhooksService } from './webhooks.service'

@Module({
  imports: [DatabasesModule, OrdersModule, CheckoutModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, ...WEBHOOK_EVENT_PROVIDER],
  exports: [WebhooksService, ...WEBHOOK_EVENT_PROVIDER],
})
export class WebhooksModule {}
