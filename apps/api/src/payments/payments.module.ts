import { Module } from '@nestjs/common'
import { CheckoutModule } from 'src/checkout/checkout.module'
import { DatabasesModule } from 'src/database/databases.module'
import { PAYMENT_PROVIDER } from './payment.provider'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'

@Module({
  imports: [DatabasesModule, CheckoutModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, ...PAYMENT_PROVIDER],
  exports: [PaymentsService, ...PAYMENT_PROVIDER],
})
export class PaymentsModule {}
