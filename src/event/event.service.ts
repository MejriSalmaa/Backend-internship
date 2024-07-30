import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEntity } from './event.entity';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { ObjectId } from 'mongodb';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDTO } from '../notification/dto/Notification.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventEntity.name) private eventModel: Model<EventEntity>,
    private readonly notificationService: NotificationService,
  ) {}

  async createEvent(eventData: CreateEventDto, creatorEmail: string): Promise<EventEntity> {
    eventData.creator = creatorEmail;
    const createdEvent = new this.eventModel(eventData);
    await createdEvent.save();

    // Create notifications for participants
    const notificationPromises = eventData.participants.map(participant => {
      const notification: CreateNotificationDTO = {
        user: participant,
        message: `You have been invited to: ${eventData.title}`,
        isRead: false,
        eventId: createdEvent._id.toString(),
      };
      return this.notificationService.createNotification(notification);
    });
    await Promise.all(notificationPromises);

    return createdEvent;
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto, userEmail: string): Promise<EventEntity> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creator.toString() !== userEmail) {
      throw new ForbiddenException('You are not authorized to update this event');
    }

    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }

    // Create notifications for participants about the update
    const notificationPromises = updatedEvent.participants.map(participant => {
      const notification: CreateNotificationDTO = {
        user: participant,
        message: `The event "${updatedEvent.title}" has been updated.`,
        isRead: false,
        eventId: updatedEvent._id.toString(),
      };
      return this.notificationService.createNotification(notification);
    });
    await Promise.all(notificationPromises);

    return updatedEvent;
  }

  async remove(eventId: string, userEmail: string): Promise<{ deleted: boolean }> {
    const event = await this.findByIdEvent(eventId);

    if (!event) {
      throw new NotFoundException('Event not found delete');
    }
    
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

  async searchEvents(query: string): Promise<EventEntity[]> {
    const searchRegex = new RegExp(query, 'i'); // Case-insensitive search
    return this.eventModel.find({
      $or: [
        { title: searchRegex },
        { creator: searchRegex },
        { category: searchRegex },
      ],
    }).exec();
  }
}
