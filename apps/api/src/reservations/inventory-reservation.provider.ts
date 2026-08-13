import { DataSource } from 'typeorm'
import { DATA_SOURCE } from 'src/shared/constants'
import { INVENTORY_RESERVATION_REPOSITORY } from './constants'
import { InventoryReservation } from './inventory-reservation.entity'

export const INVENTORY_RESERVATION_PROVIDER = [
  {
    provide: INVENTORY_RESERVATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(InventoryReservation),
    inject: [DATA_SOURCE],
  },
]
