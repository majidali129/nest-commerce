import { DataSource } from 'typeorm'
import { DATA_SOURCE } from 'src/shared/constants'
import { ORDER_ITEM_REPOSITORY, ORDER_REPOSITORY } from './constants'
import { Order } from './order.entity'
import { OrderItem } from './order-item.entity'

export const ORDER_PROVIDER = [
  {
    provide: ORDER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: [DATA_SOURCE],
  },
  {
    provide: ORDER_ITEM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderItem),
    inject: [DATA_SOURCE],
  },
]
