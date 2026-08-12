import { Module } from '@nestjs/common'
import { DatabasesModule } from 'src/database/databases.module'
import { INVENTORY_RESERVATION_PROVIDER } from 'src/reservations/inventory-reservation.provider'
import { CheckoutService } from './checkout.service'

@Module({
  imports: [DatabasesModule],
  providers: [CheckoutService, ...INVENTORY_RESERVATION_PROVIDER],
  exports: [CheckoutService],
})
export class CheckoutModule {}
