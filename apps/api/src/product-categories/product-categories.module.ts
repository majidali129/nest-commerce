import { Module } from "@nestjs/common";
import { DatabasesModule } from "src/database/databases.module";
import { PRODUCT_CATEGORY_PROVIDER } from "./product-category.provider";
import { ProductCategoriesController } from "./product-categories.controller";
import { ProductCategoriesService } from "./product-categories.service";

@Module({
    imports: [DatabasesModule],
    controllers: [ProductCategoriesController],
    providers: [ProductCategoriesService, ...PRODUCT_CATEGORY_PROVIDER],
    exports: [ProductCategoriesService, ...PRODUCT_CATEGORY_PROVIDER]
})  

export class ProductCategoriesModule {}