/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UserEntity } from '../user/user.entity';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,   

  ) {}

  async register(registerDto: RegisterDto, file?: Express.Multer.File): Promise<UserEntity> {
    const existingUser = await this.userModel.findOne({ email: registerDto.email }).lean();
    if (existingUser) {
      throw new HttpException('Email is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  
    // Handle file upload if picture is provided
    if (file) {
      registerDto.picture = `/uploads/${file.filename}`; // Use the filename generated by multer
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

    const payload = { email: user.email, sub: user._id , role: user.role, username: user.username, picture: user.picture};
    const token = this.jwtService.sign(payload);

    return {
      
      access_token: token
    };
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (err) {
      throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
    }
  }
  
  async getProfile(userId: string): Promise<any> {
    try {
      const user = await this.userModel.findById(userId).select('email username picture role').lean();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        email: user.email,
        username: user.username,
        picture: user.picture || null, // Return picture URL if available
        role: user.role
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



}