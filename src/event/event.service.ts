/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEntity } from './event.entity';
import { CreateEventDto } from './dto/createEvent.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventEntity.name) private   eventModel: Model<EventEntity>,
  ) {}

  async createEvent(eventData: CreateEventDto): Promise<EventEntity> {
    const createdEvent = new this.eventModel(eventData);
    return createdEvent.save();
  }
}
