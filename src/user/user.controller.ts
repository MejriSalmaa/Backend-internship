/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  Body,
  UseGuards,
  Put,
  Post,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto'; // Ensure this DTO exists
import { UpdateProfileDto } from './dto/UpdateProfileDto.dto'; // Ensure this DTO exists
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';

@ApiTags('users')

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

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()

  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin) // Ensure this matches the role decorator for admin
  @ApiBearerAuth()

  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin) // Ensure this matches the role decorator for admin
  @ApiBearerAuth()

  async removeUser(@Param('id') id: string): Promise<void> {
    try {
      await this.userService.removeUser(id);
    } catch (error) {
      throw new Error(`Failed to remove user: ${error.message}`);
    }
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  async getProfile(@Request() req) {
    try {
      const profile = await this.userService.getProfile(req.user.email);
      // Debugging: log the profile data
      console.log('Profile fetched:', profile);
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new BadRequestException('Failed to fetch profile');
    }
  }

  @Put('profile/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads', // Specify the directory to save uploaded files
        filename: (req, file, cb) => {
          // Generate a unique filename
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // Handle the uploaded file if it exists
      if (file) {
        updateProfileDto.picture = `/uploads/${file.filename}`; // Save the path of the uploaded picture
      }

      return await this.userService.updateProfile(req.user.email, updateProfileDto);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new BadRequestException('Failed to update profile');
    }
  }
}
