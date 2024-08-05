/* eslint-disable prettier/prettier */

import { IsString, IsNotEmpty, IsEnum, IsArray, IsEmail,IsDateString } from 'class-validator';

export enum EventCategory {
  Anniversaire = 'Anniversaire',
  Teambuilding = 'Teambuilding',
  ÉvénementSocial = 'Événement social',
  ÉvénementSportif = 'Événement sportif',
  Séminaire = 'Séminaire',
  Formation = 'Formation',
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EventCategory)
  @IsNotEmpty()
  category: EventCategory;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  startDate: string; // ISO 8601 format

  @IsDateString()
  endDate: string; // ISO 8601 format


  @IsEmail()
  @IsNotEmpty()
  creator: string;

  @IsArray()
  @IsEmail({}, { each: true })
  participants: string[];
}
