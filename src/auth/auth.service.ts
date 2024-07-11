/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus , UseGuards, Get ,Request} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const existingUser = await this.userModel.findOne({ email: registerDto.email }).lean();
    if (existingUser) {
      throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const createdUser = new this.userModel(registerDto);
    return createdUser.save();
  }

  async loginUser(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email }).select('+password').lean();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(loginDto.password, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect password', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);

    return {
      user,
      token
    };
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (err) {
      throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
    }
  }
  
}
