/* eslint-disable prettier/prettier */

import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'Profile picture of the user', type: 'string', format: 'binary', required: false })
  @IsOptional()
  picture?: any;

  @ApiProperty({ description: 'The state of the user', default: false })
  @IsBoolean()
  readonly etat: boolean = false;

  @ApiProperty({ description: 'The role of the user', enum: Role, default: Role.User })
  @IsEnum(Role, { message: 'Role must be either admin or user' })
  readonly role: Role = Role.User;
}
