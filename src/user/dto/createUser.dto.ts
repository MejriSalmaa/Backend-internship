import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string
  @IsNotEmpty()
  @IsEmail()
  readonly email: string
  @IsNotEmpty()
  readonly password: string
  @IsOptional()
  @IsUrl()
  readonly picture: string
}