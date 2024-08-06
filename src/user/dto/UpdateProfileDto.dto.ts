/* eslint-disable prettier/prettier */

import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ description: 'The username of the user', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Profile picture of the user', type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({ description: 'The new password of the user', minLength: 4, required: false })
  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password?: string;
}
