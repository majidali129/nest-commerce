import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { DatabasesModule } from './database/databases.module'
import { ProductsModule } from './products/products.module'
import { ProductCategoriesModule } from './product-categories/product-categories.module'
import { ProductVariantsModule } from './product-variants/product-variants.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { CartsModule } from './carts/carts.module'
import { AddressesModule } from './addresses/addresses.module'
import { CheckoutModule } from './checkout/checkout.module'
import { PaymentsModule } from './payments/payments.module'
import { OrdersModule } from './orders/orders.module'
import { ReservationsModule } from './reservations/reservations.module'
import { WebhooksModule } from './webhooks/webhooks.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    DatabasesModule,
    ProductsModule,
    ProductCategoriesModule,
    ProductVariantsModule,
    CloudinaryModule,
    CartsModule,
    AddressesModule,
    CheckoutModule,
    OrdersModule,
    PaymentsModule,
    ReservationsModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
