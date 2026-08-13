import { DataSource } from "typeorm";
import { PRODUCT_CATEGORY_REPOSITORY } from "./constants";
import { ProductCategory } from "./product-category.entity";
import { DATA_SOURCE } from "src/shared/constants";


export const PRODUCT_CATEGORY_PROVIDER = [
    {
        provide: PRODUCT_CATEGORY_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository<ProductCategory>(ProductCategory),
        inject: [DATA_SOURCE]
    }
]