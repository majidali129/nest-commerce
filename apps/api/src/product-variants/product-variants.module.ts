import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
import { PRODUCT_VARIANT_PROVIDER } from './product-variant.provider';
import { DatabasesModule } from 'src/database/databases.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [DatabasesModule, ProductsModule],
  providers: [ProductVariantsService, ...PRODUCT_VARIANT_PROVIDER],
  controllers: [ProductVariantsController],
  exports: [...PRODUCT_VARIANT_PROVIDER, ProductVariantsService],
})
export class ProductVariantsModule {}