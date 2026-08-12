import { DataSource } from "typeorm";
import { PRODUCT_REPOSITORY } from "./constants";
import { Product } from "./product.entity";
import { DATA_SOURCE } from "src/shared/constants";


export const PRODUCT_PROVIDER = [
    {
        provide: PRODUCT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository<Product>(Product),
        inject: [DATA_SOURCE]
    }
]