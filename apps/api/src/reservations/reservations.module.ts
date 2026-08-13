import { Module } from '@nestjs/common'
import { CheckoutModule } from 'src/checkout/checkout.module'
import { DatabasesModule } from 'src/database/databases.module'
import { ORDER_PROVIDER } from 'src/orders/order.provider'
import { INVENTORY_RESERVATION_PROVIDER } from './inventory-reservation.provider'
import { ReservationsController } from './reservations.controller'
import { ReservationsService } from './reservations.service'
import { ReservationsExpiryService } from './reservations-expiry.service'

@Module({
  imports: [DatabasesModule, CheckoutModule],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationsExpiryService,
    ...INVENTORY_RESERVATION_PROVIDER,
    ...ORDER_PROVIDER,
  ],
  exports: [ReservationsService, ...INVENTORY_RESERVATION_PROVIDER],
})
export class ReservationsModule {}
