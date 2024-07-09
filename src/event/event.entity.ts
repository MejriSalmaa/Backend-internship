/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum EventCategory {
  Anniversaire = 'Anniversaire',
  Teambuilding = 'Teambuilding',
  Social = 'Événement social',
  Sportif = 'Événement sportif',
  Seminaire = 'Séminaire',
  Formation = 'Formation',
}

@Schema()
export class EventEntity extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: EventCategory })
  category: EventCategory;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  creator: string;

  @Prop({ type: [String], default: [] })
  participants: string[];
}

export const EventEntitySchema = SchemaFactory.createForClass(EventEntity);
