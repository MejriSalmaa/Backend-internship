/* eslint-disable prettier/prettier */

import { IsString, IsNotEmpty, IsEnum, IsArray, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EventCategory {
  Anniversaire = 'Anniversaire',
  Teambuilding = 'Teambuilding',
  ÉvénementSocial = 'Événement social',
  ÉvénementSportif = 'Événement sportif',
  Séminaire = 'Séminaire',
  Formation = 'Formation',
}

export class CreateEventDto {
  @ApiProperty({ description: 'The title of the event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the event' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The category of the event', enum: EventCategory })
  @IsEnum(EventCategory)
  @IsNotEmpty()
  category: EventCategory;

  @ApiProperty({ description: 'The location where the event will take place' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'The start date of the event', type: 'string', format: 'date-time' })
  @IsDateString()
  startDate: string; // ISO 8601 format

  @ApiProperty({ description: 'The end date of the event', type: 'string', format: 'date-time' })
  @IsDateString()
  endDate: string; // ISO 8601 format

  @ApiProperty({ description: 'The email of the event creator' })
  @IsEmail()
  @IsNotEmpty()
  creator: string;

  @ApiProperty({ description: 'The list of participant emails', type: [String], format: 'email' })
  @IsArray()
  @IsEmail({}, { each: true })
  participants: string[];
}
