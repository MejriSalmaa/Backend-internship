/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module'; // Only import the module
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express'; // Import MulterModule


@Module({
  imports: [
    
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/internship'),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global
    }),
    MulterModule.register({
      dest: './uploads', // Specify directory to store uploaded files
    }),
    UserModule,
    EventModule,
    AuthModule,
   
  ],
  controllers: [AppController], // Only declare AppController here
  providers: [AppService], // Only declare AppService here
})
export class AppModule { }