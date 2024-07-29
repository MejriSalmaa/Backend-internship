/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EventModule } from './event/event.module'; // Only import the module
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { NotificationModule } from './notification/notification.module';
@Module({
  imports: [
    
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/internship'),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global
    }),
    UserModule,
    EventModule,
    AuthModule,
    NotificationModule, // Keep module imports together
  ],
  controllers: [AppController], // Only declare AppController here
  providers: [AppService], // Only declare AppService here
})
export class AppModule { }