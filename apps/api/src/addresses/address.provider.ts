import { DataSource } from 'typeorm'
import { DATA_SOURCE } from 'src/shared/constants'
import { ADDRESS_REPOSITORY } from './constants'
import { Address } from './address.entity'

export const ADDRESS_PROVIDER = [
  {
    provide: ADDRESS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Address),
    inject: [DATA_SOURCE],
  },
]
