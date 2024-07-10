/* eslint-disable prettier/prettier */

import { Controller, Post, Body, HttpException, HttpStatus, Request ,UseGuards , Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
  
}
