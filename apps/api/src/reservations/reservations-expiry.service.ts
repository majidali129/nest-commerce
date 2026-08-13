import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CheckoutService } from 'src/checkout/checkout.service'
import { ORDER_REPOSITORY, OrderStatus } from 'src/orders/constants'
import { Order } from 'src/orders/order.entity'
import { ReservationsService } from './reservations.service'

const SWEEP_INTERVAL_MS = 60_000

@Injectable()
export class ReservationsExpiryService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ReservationsExpiryService.name)
  private timer: ReturnType<typeof setInterval> | null = null
  private running = false

  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly checkoutService: CheckoutService,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: Repository<Order>,
  ) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      void this.sweepExpired()
    }, SWEEP_INTERVAL_MS)
    setTimeout(() => void this.sweepExpired(), 5_000)
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  async sweepExpired(): Promise<void> {
    if (this.running) return
    this.running = true
    try {
      const orderIds =
        await this.reservationsService.findExpiredActiveOrderIds()
      if (!orderIds.length) return

      for (const orderId of orderIds) {
        try {
          const order = await this.orderRepo.findOne({
            where: { id: orderId },
          })
          if (!order) continue

          if (order.status === OrderStatus.PENDING) {
            await this.checkoutService.cancelPending(orderId, {
              reason: 'Checkout reservation expired',
              markExpired: true,
            })
            this.logger.log(
              `Released expired reservations for pending order ${orderId}`,
            )
            continue
          }

          await this.checkoutService.releaseStaleReservations(orderId, true)
          this.logger.log(
            `Cleaned stale active reservations for order ${orderId} (${order.status})`,
          )
        } catch (error) {
          this.logger.error(
            `Failed to expire reservations for order ${orderId}`,
            error instanceof Error ? error.stack : undefined,
          )
        }
      }
    } finally {
      this.running = false
    }
  }
}
