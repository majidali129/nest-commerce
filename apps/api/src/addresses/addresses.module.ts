import { Module } from '@nestjs/common'
import { DatabasesModule } from 'src/database/databases.module'
import { ADDRESS_PROVIDER } from './address.provider'
import { AddressesController } from './addresses.controller'
import { AddressesService } from './addresses.service'

@Module({
  imports: [DatabasesModule],
  providers: [AddressesService, ...ADDRESS_PROVIDER],
  controllers: [AddressesController],
  exports: [AddressesService],
})
export class AddressesModule {}
