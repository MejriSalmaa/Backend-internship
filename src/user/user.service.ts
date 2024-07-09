/* eslint-disable prettier/prettier */
import {  Injectable , HttpException , HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './user.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { LoginDto } from '../auth/dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    private readonly jwtService: JwtService,  // Inject JwtService here

  ) {}

  async loginUser(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ email: loginDto.email }).select('+password').lean();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(loginDto.password, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect password', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const payload = { sub: user._id, username: user.username, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async findUserById(id: string): Promise<UserEntity | undefined> {
    const objectId = new ObjectId(id);
    return await this.userModel.findOne({ _id: objectId }).exec();
  }
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
