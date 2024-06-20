import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createUserDto)
    return user
  }

  @Post('/users/login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const user = await this.userService.loginUser(loginDto)
    return user
  }

 
}