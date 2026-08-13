import { DataSource } from "typeorm";
import { PRODUCT_VARIANT_REPOSITORY } from "./constants";
import { ProductVariant } from "./product-variant.entity";
import { DATA_SOURCE } from "src/shared/constants";

export const PRODUCT_VARIANT_PROVIDER = [
    {
        provide: PRODUCT_VARIANT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductVariant),
        inject: [DATA_SOURCE],
    }
];