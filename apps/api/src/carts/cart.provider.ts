import { DataSource } from 'typeorm'
import { DATA_SOURCE } from 'src/shared/constants'
import { CART_ITEM_REPOSITORY, CART_REPOSITORY } from './constants'
import { Cart } from './cart.entity'
import { CartItem } from './cart-item.entity'

export const CART_PROVIDER = [
  {
    provide: CART_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Cart),
    inject: [DATA_SOURCE],
  },
  {
    provide: CART_ITEM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CartItem),
    inject: [DATA_SOURCE],
  },
]
