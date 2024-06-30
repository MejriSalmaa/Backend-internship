import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
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
    const user = await this.userService.loginUser(loginDto,response);
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
  
  @Get('user')
  async user(@Req() request: Request): Promise<any> {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
  
      if (!data) {
        throw new UnauthorizedException();
      }
  
      // Assuming your userService has a method to find a user by ID
      const user = await this.userService.findUserById(data.sub); // Adjust method name and parameter as necessary
  
      if (!user) {
        throw new UnauthorizedException();
      }
  
      const { password, ...result } = user;
      return result;
    } catch (e) {
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