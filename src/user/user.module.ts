/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserEntity, UserEntitySchema } from './user.entity';
import { UserController } from './user.controller';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserEntitySchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET , // Add your secret key here
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],

  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
