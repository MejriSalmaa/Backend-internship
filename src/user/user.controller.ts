import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
  @Post('/users/login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    // Step 1: Validate user credentials
    const user = await this.userService.loginUser(loginDto);
    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).send('Invalid credentials');
    }
  
    // Step 2: Generate JWT token
    const payload = { username: user.username, sub: user.id }; // Customize payload as needed
    const token = this.jwtService.sign(payload);
  
    // Step 3: Set the JWT token in the cookies
    response.cookie('jwt', token, { httpOnly: true });
  
    // Step 4: Return a success message
    return {
      message: 'success'
    };
  }
}