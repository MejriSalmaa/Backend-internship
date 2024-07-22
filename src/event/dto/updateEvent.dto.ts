/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsEnum, IsDate, IsArray, IsEmail ,IsDateString} from 'class-validator';
import { Type } from 'class-transformer';
import { EventCategory } from './createEvent.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  startDate: Date; // ISO 8601 format

  @IsDateString()
  endDate: Date; // ISO 8601 format

  @IsOptional()
  @IsEmail()
  creator?: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  participants?: string[];
}
