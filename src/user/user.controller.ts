import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { ObjectId } from 'mongodb'; // Import ObjectId from MongoDB driver

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
    const user = await this.userService.loginUser(loginDto,response);
    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).send('Invalid credentials');
    }
  console.log('user', user);
    // Step 2: Generate JWT token
    const payload = { sub: user.user._id, username: user.user.username };
    console.log('payload', payload);
    // Customize payload as needed
    const token = await this.jwtService.signAsync(payload);
    console.log('Generated token:', token);

    // Step 3: Set the JWT token in the cookies
    response.cookie('jwt', token, { httpOnly: true });
  
    // Step 4: Return a success message
    return {
      message: 'success'
    };
  }
  @Get('user')
  async user(@Req() request: Request): Promise<any> {
    try {
      console.log('Cookies:', request.cookies); // Log cookies for debugging
      const cookie = request.cookies['jwt'];
  
      // Runtime check to ensure cookie is a string
      if (typeof cookie !== 'string' || !cookie) {
        console.error('JWT cookie is missing or not a string');
        throw new UnauthorizedException('JWT cookie is missing or not a string');
      }
  
      const data = await this.jwtService.verifyAsync(cookie as string); 
      console.log("data",data);// Type assertion, useful if verifyAsync strictly requires a string
      if (!data) {
        console.error('JWT verification failed');
        throw new UnauthorizedException('JWT verification failed');
      }
  
      const user = await this.userService.findUserById(data.sub);
      if (!user) {
        console.error('User not found', data.sub);
        throw new UnauthorizedException('User not found');
      }
  
      const { password, ...result } = user;
      return result;
    } catch (e) {
      console.error('Error in user method:', e);
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
      response.clearCookie('jwt');

      return {
          message: 'success logout'
      }
  }
 
}