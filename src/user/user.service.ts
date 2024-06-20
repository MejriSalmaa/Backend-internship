import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserEntity.name) private userModel: Model<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userModel.findOne({email: createUserDto.email})

    if (user) {
      throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const createdUser = new this.userModel(createUserDto)
    return createdUser.save()
  }


 
}