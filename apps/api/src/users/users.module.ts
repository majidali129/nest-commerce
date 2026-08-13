import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DatabasesModule } from 'src/database/databases.module'
import { USER_PROVIDER } from './user.provider'
import { NotificationsModule } from 'src/notifications/notifications.module'

@Module({
  imports: [DatabasesModule, NotificationsModule],
  controllers: [UsersController],
  providers: [UsersService, ...USER_PROVIDER],
  exports: [UsersService, ...USER_PROVIDER],
})
export class UsersModule {}
