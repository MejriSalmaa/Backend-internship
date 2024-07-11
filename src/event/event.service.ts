/* eslint-disable prettier/prettier */

import { Injectable ,NotFoundException,UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEntity } from './event.entity';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { ObjectId } from 'mongodb';

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

  async remove(eventId: string, userEmail: string): Promise<{ deleted: boolean }> {
    const event = await this.findByIdEvent(eventId);
  
    if (!event) {
      throw new NotFoundException('Event not found delete');
    }
    
   
    // Check if event.creator and userEmail are defined
    if (!event.creator || !userEmail) {
      throw new Error('Missing creator or user email');
    }
  
    if (event.creator !== userEmail) {
      throw new UnauthorizedException('You do not have permission to delete this event');
    }
  
    await this.eventModel.deleteOne({ _id: eventId });
    return { deleted: true };
  }
  async findByIdEvent(id: string): Promise<EventEntity | undefined> {
    const objectId = new ObjectId(id);
    return await this.eventModel.findOne({ _id: objectId }).exec();
    
  }

  async findAll(): Promise<EventEntity[]> {
    return this.eventModel.find().exec();
  }
}
