/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus , UseGuards, Get ,Request,Post,Res} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

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

    // Handle file upload if picture is provided
    if (registerDto.picture) {
      const file = registerDto.picture;

      // Example path to store uploads
      const uploadPath = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadPath, fileName);

      if (file.buffer) {
        fs.writeFileSync(filePath, file.buffer);
        registerDto.picture = `/uploads/${fileName}`; // Adjust this URL as per your setup
      } else {
        throw new HttpException('File buffer is not defined', HttpStatus.BAD_REQUEST);
      }
    }
    

    const createdUser = new this.userModel(registerDto);
    return createdUser.save();
  }catch (error) {
    console.error('Error in AuthService.register:', error);
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
  

}