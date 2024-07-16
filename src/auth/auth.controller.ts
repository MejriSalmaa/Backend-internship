/* eslint-disable prettier/prettier */

import { Controller, Post, Body, HttpException, HttpStatus, Request ,UseGuards , Get , UseInterceptors,Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Response } from 'express';

import * as multer from 'multer';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('picture', {
    storage: multer.memoryStorage(), // Store file in memory
  }))
  async register(@Body() registerDto: RegisterDto, @UploadedFile() file: Express.Multer.File) {
    try {
      if (file) {
        registerDto.picture = file; // File buffer is now available
      }
      return await this.authService.register(registerDto);
    } catch (error) {
      console.error('Error in AuthController.register:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      return await this.authService.loginUser(loginDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('protected')
  async protectedRoute(@Request() req) {
    return { message: 'You have access to this protected route', user: req.user };
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)

  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {

      response.clearCookie('jwt');
      return {
          message: 'success logout'
      }
}
}
