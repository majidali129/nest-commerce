import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PRODUCT_PROVIDER } from './product.provider';
import { DatabasesModule } from 'src/database/databases.module';
import { ProductCategoriesModule } from 'src/product-categories/product-categories.module';

@Module({
  imports: [DatabasesModule, ProductCategoriesModule],
  providers: [ProductsService, ...PRODUCT_PROVIDER],
  controllers: [ProductsController],
  exports: [ProductsService, ...PRODUCT_PROVIDER]
})
export class ProductsModule {}
