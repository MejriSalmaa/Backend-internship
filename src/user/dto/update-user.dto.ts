/* eslint-disable prettier/prettier */

import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../role.enum'; // Adjust the import path as needed

export class UpdateUserDto {
  @ApiProperty({ description: 'The username of the user', required: false })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiProperty({ description: 'The email of the user', required: false })
  @IsOptional()
  @IsString()
  readonly email?: string;

  @ApiProperty({ description: 'Profile picture of the user', type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  readonly picture?: string;

  @ApiProperty({ description: 'The state of the user', required: false })
  @IsOptional()
  @IsBoolean()
  readonly etat?: boolean;

  @ApiProperty({ description: 'The role of the user', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either admin or user' })
  readonly role?: Role;
}
