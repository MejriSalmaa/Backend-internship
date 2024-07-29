import { Controller, Get, Param, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  testRoute() {
    return 'Test route working';
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserEntity> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  @Get('emails/:search')
  async getEmailsByParam(@Param('search') search: string) {

    if (!search) {
      throw new BadRequestException('Search parameter is required');
    }

    try {
      const emails = await this.userService.findEmails(search);
      return emails;
    } catch (error) {
      console.error('Error in getEmailsByParam:', error);
      throw new BadRequestException('Failed to fetch emails');
    }
  }
}
