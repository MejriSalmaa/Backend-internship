/* eslint-disable prettier/prettier */

import { Controller, Post, Body, HttpException, HttpStatus, Request ,UseGuards , Get , UseInterceptors,Res,Query} from '@nestjs/common';
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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';

import * as multer from 'multer';
@ApiTags('auth')


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
@UseInterceptors(
  FileInterceptor('picture', {
    storage: diskStorage({
      destination: './uploads', // Ensure this directory exists
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtName = extname(file.originalname);
        const fileName = `${uniqueSuffix}${fileExtName}`;
        callback(null, fileName);
      },
    }),
  }),
)
async register(@Body() registerDto: RegisterDto, @UploadedFile() file: Express.Multer.File) {
  try {
    return await this.authService.register(registerDto, file);
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
  @ApiBearerAuth()

  @Post('protected')
  async protectedRoute(@Request() req) {
    return { message: 'You have access to this protected route', user: req.user };
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub; // Assuming `sub` is the user ID in the JWT payload
    return this.authService.getProfile(userId);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {

      response.clearCookie('jwt');
      return {
          message: 'success logout'
      }
}


}
