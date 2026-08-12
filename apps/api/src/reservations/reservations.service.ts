import { Inject, Injectable } from '@nestjs/common'
import { LessThan, Repository } from 'typeorm'
import {
  INVENTORY_RESERVATION_REPOSITORY,
  ReservationStatus,
} from './constants'
import { InventoryReservation } from './inventory-reservation.entity'

/** Read-only reservation queries. Mutations live in CheckoutService. */
@Injectable()
export class ReservationsService {
  constructor(
    @Inject(INVENTORY_RESERVATION_REPOSITORY)
    private readonly reservationRepo: Repository<InventoryReservation>,
  ) {}

  async findActiveByOrderId(
    orderId: number,
  ): Promise<InventoryReservation[]> {
    return this.reservationRepo.find({
      where: { orderId, status: ReservationStatus.ACTIVE },
    })
  }

  async findExpiredActiveOrderIds(): Promise<number[]> {
    const rows = await this.reservationRepo.find({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: LessThan(new Date()),
      },
      select: { orderId: true },
    })

    return [
      ...new Set(
        rows
          .map((r) => r.orderId)
          .filter((id): id is number => id != null),
      ),
    ]
  }

  async hasActiveReservations(orderId: number): Promise<boolean> {
    const count = await this.reservationRepo.count({
      where: { orderId, status: ReservationStatus.ACTIVE },
    })
    return count > 0
  }
}
