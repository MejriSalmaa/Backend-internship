/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventEntity, EventEntitySchema } from './event.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module'; // Import UserModule
import { UserEntity, UserEntitySchema } from '../user/user.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventEntitySchema },
      { name: UserEntity.name, schema: UserEntitySchema },

    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // Ensure to use a secure, environment-specific way to handle the secret in production
      signOptions: { expiresIn: '1d' }
    }),UserModule,
    NotificationModule,


  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}