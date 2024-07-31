import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
   picture?: any;

  @IsBoolean()
  readonly etat: boolean = false;

  @IsEnum(Role, { message: 'Role must be either admin or user' })
  readonly role: Role = Role.User;
}