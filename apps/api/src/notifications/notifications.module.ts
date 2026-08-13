import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SlackService } from './slack/slack.service';

@Module({
  providers: [NotificationsService, SlackService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
