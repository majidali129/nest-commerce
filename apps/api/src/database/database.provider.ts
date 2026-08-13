import { DATA_SOURCE } from 'src/shared/constants'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const databaseUrl = configService.get<string>('DATABASE_URL')
      const synchronize =
        configService.get<string>('TYPEORM_SYNC') === 'true'
      const entities = [__dirname + '/../**/*.entity{.ts,.js}']

      const dataSource = databaseUrl
        ? new DataSource({
            type: 'postgres',
            url: databaseUrl,
            entities,
            synchronize,
            ssl: {
              rejectUnauthorized: false,
            },
          })
        : new DataSource({
            type: 'postgres',
            host: configService.get('PGHOST'),
            port: Number(configService.get('PGPORT') ?? 5432),
            username: configService.get('PGUSER'),
            password: configService.get('PGPASSWORD'),
            database: configService.get('PGDATABASE'),
            entities,
            synchronize:
              synchronize ||
              configService.get<string>('NODE_ENV') !== 'production',
          })

      return dataSource.initialize()
    },
  },
]
