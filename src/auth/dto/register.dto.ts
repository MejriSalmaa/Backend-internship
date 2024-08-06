/* eslint-disable prettier/prettier */

import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Ensure this is installed

enum Role {
  Admin = 'admin',
  User = 'user',
}

export class RegisterDto  {
  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user',
    required: true,
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: true,
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The profile picture of the user',
    required: false,
  })
  @IsOptional()
  picture?: any; // Use Express.Multer.File if using Multer, or any if the type is not yet defined

  @ApiProperty({
    example: false,
    description: 'The state of the user (active/inactive)',
    required: true,
  })
  @IsBoolean()
  readonly etat: boolean = false;

  @ApiProperty({
    example: Role.User,
    description: 'The role of the user',
    enum: Role,
    default: Role.User,
    required: true,
  })
  @IsEnum(Role, { message: 'Role must be either admin or user' })
  readonly role: Role = Role.User;
}
