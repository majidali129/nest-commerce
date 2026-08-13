import { DATA_SOURCE } from "src/shared/constants";
import {DataSource} from 'typeorm'
import {ConfigService} from '@nestjs/config'

export const databaseProviders = [
    {
        provide: DATA_SOURCE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            // LOCALHOST SETUP
            // const dataSource = new DataSource({
            //     type: "postgres",
            //     host: configService.get('POSTGRES_HOST'),
            //     port: configService.get('POSTGRES_PORT'),
            //     username: configService.get('POSTGRES_USER'),
            //     password: configService.get('POSTGRES_PASSWORD'),
            //     database: configService.get('POSTGRES_DATABASE'),
            //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            //     synchronize: true,
            // });

            // RAILWAY SETUP
            const dataSource = new DataSource({
                type: "postgres",
                url: configService.get('DATABASE_URL'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: false,
                ssl: {
                    rejectUnauthorized: false,
                }
            });

            return dataSource.initialize()
        },
    }
]