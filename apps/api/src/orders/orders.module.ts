import { Module } from '@nestjs/common'
import { CheckoutModule } from 'src/checkout/checkout.module'
import { DatabasesModule } from 'src/database/databases.module'
import { PAYMENT_PROVIDER } from 'src/payments/payment.provider'
import { ORDER_PROVIDER } from './order.provider'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

@Module({
  imports: [DatabasesModule, CheckoutModule],
  controllers: [OrdersController],
  providers: [OrdersService, ...ORDER_PROVIDER, ...PAYMENT_PROVIDER],
  exports: [OrdersService, ...ORDER_PROVIDER],
})
export class OrdersModule {}
