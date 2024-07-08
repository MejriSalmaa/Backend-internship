/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @Post('/users/login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    const loginResult = await this.userService.loginUser(loginDto);

    if (loginResult.message === 'success') {
      const token = await this.userService.generateJwt(loginResult.user);
      response.cookie('jwt', token, { httpOnly: true });
      return { message: 'success' };
    }

    return response.status(HttpStatus.UNAUTHORIZED).send('Invalid credentials');
  }

  @Get('user')
  async getUser(@Req() request: Request): Promise<any> {
    try {
      const cookie = request.cookies['jwt'];

      if (typeof cookie !== 'string' || !cookie) {
        throw new UnauthorizedException('JWT cookie is missing or not a string');
      }

      const data = await this.userService.verifyJwt(cookie);
      if (!data) {
        throw new UnauthorizedException('JWT verification failed');
      }

      const user = await this.userService.findUserById(data.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password, ...result } = user;
      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'success logout' };
  }
}
