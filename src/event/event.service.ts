/* eslint-disable prettier/prettier */

import { Injectable ,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEntity } from './event.entity';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';
@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventEntity.name) private   eventModel: Model<EventEntity>,
  ) {}


  async createEvent(eventData: CreateEventDto, creatorEmail: string): Promise<EventEntity> {
    eventData.creator = creatorEmail; // Set the creator's email
    const createdEvent = new this.eventModel(eventData);
    return createdEvent.save();
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto): Promise<EventEntity> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }
    return updatedEvent;
  }
}
