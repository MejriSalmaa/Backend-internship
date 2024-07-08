/* eslint-disable prettier/prettier */

import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

enum Role {
  Admin = 'admin',
  User = 'user',
}

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @IsUrl()
  readonly picture?: string;

  @IsBoolean()
  readonly etat: boolean = false;

  @IsEnum(Role, { message: 'Role must be either admin or user' })
  readonly role: Role = Role.User;
}