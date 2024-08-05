/* eslint-disable prettier/prettier */

import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../role.enum'; // Adjust the import path as needed

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly picture?: string;

  @IsOptional()
  @IsBoolean()
  readonly etat?: boolean;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either admin or user' })
  readonly role?: Role;
}
