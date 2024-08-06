/* eslint-disable prettier/prettier */

import { IsString, IsOptional, IsEnum, IsArray, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategory } from './createEvent.dto';

export class UpdateEventDto {
  @ApiProperty({ description: 'The title of the event', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The description of the event', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The category of the event', enum: EventCategory, required: false })
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @ApiProperty({ description: 'The location where the event will take place', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'The start date of the event', type: 'string', format: 'date-time' })
  @IsDateString()
  startDate: Date; // ISO 8601 format

  @ApiProperty({ description: 'The end date of the event', type: 'string', format: 'date-time' })
  @IsDateString()
  endDate: Date; // ISO 8601 format

  @ApiProperty({ description: 'The email of the event creator', required: false })
  @IsOptional()
  @IsEmail()
  creator?: string;

  @ApiProperty({ description: 'The list of participant emails', type: [String], format: 'email', required: false })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  participants?: string[];
}
