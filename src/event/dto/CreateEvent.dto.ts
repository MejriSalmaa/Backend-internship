/* eslint-disable prettier/prettier */

import { IsString, IsNotEmpty, IsEnum, IsDate, IsArray, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @IsEmail()
  @IsNotEmpty()
  creator: string;

  @IsArray()
  @IsEmail({}, { each: true })
  participants: string[];
}
