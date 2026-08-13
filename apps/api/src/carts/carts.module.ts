import { Module } from '@nestjs/common'
import { DatabasesModule } from 'src/database/databases.module'
import { ProductVariantsModule } from 'src/product-variants/product-variants.module'
import { CART_PROVIDER } from './cart.provider'
import { CartsController } from './carts.controller'
import { CartsService } from './carts.service'

@Module({
  imports: [DatabasesModule, ProductVariantsModule],
  providers: [CartsService, ...CART_PROVIDER],
  controllers: [CartsController],
  exports: [CartsService],
})
export class CartsModule {}
