/* eslint-disable prettier/prettier */

import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'; // Ensure this is installed

enum Role {
  Admin = 'admin',
  User = 'user',
}

export class RegisterDto  {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
  @IsOptional()
  // @IsUrl() // Remove this if you're accepting file uploads
  @ApiProperty({ type: 'string', format: 'binary' }) // Swagger decorator for file upload
   picture?: any; // Use Express.Multer.File if using Multer, or any if the type is not yet defined


  @IsBoolean()
  readonly etat: boolean = false;

  @IsEnum(Role, { message: 'Role must be either admin or user' })
  readonly role: Role = Role.User;
}