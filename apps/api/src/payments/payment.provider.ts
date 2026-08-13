import { DataSource } from 'typeorm'
import { DATA_SOURCE } from 'src/shared/constants'
import { PAYMENT_REPOSITORY } from './constants'
import { Payment } from './payment.entity'

export const PAYMENT_PROVIDER = [
  {
    provide: PAYMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Payment),
    inject: [DATA_SOURCE],
  },
]
