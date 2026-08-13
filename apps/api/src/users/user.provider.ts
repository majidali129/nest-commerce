import { DataSource } from "typeorm";
import { USER_REPOSITORY } from "./constants";
import { User } from "./user.entity";
import { DATA_SOURCE } from "src/shared/constants";


export const USER_PROVIDER = [
    {
        provide: USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository<User>(User),
        inject: [DATA_SOURCE]
    }
]