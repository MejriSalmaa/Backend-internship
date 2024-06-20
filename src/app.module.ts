import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule,MongooseModule.forRoot('mongodb://127.0.0.1:27017/internship')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}