import { DataSource } from 'typeorm'
import { DATA_SOURCE } from 'src/shared/constants'
import { WEBHOOK_EVENT_REPOSITORY } from './constants'
import { WebhookEvent } from './webhook-event.entity'

export const WEBHOOK_EVENT_PROVIDER = [
  {
    provide: WEBHOOK_EVENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(WebhookEvent),
    inject: [DATA_SOURCE],
  },
]
