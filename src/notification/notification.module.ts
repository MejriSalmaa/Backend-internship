import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './notification.entity'; // Adjust the path as necessary
import { EventEntity, EventEntitySchema } from '../event/event.entity'; // Adjust the path as necessary

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: EventEntity.name, schema: EventEntitySchema }]),

  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports:[NotificationService],
})
export class NotificationModule {}
