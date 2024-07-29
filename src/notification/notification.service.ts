import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.entity'; // Adjust the path as necessary
import { CreateNotificationDTO } from './dto/Notification.dto'; // Adjust the path as necessary
import { EventEntity } from '../event/event.entity'; // Adjust the path as necessary

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(EventEntity.name) private eventModel: Model<EventEntity>, // Ensure the correct import path
  ) {}

  async createNotification(createNotificationDTO: CreateNotificationDTO): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDTO);
    return notification.save();
  }

  async getUserNotifications(userEmail: string): Promise<Notification[]> {
    return this.notificationModel.find({ user: userEmail }).exec();
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true }).exec();
  }

  async getUnreadNotificationCount(userEmail: string): Promise<number> {
    return this.notificationModel.countDocuments({ user: userEmail, isRead: false }).exec();
  }

  async removeParticipantFromEvent(eventId: string, userEmail: string): Promise<EventEntity> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Cast event to EventEntity to access the participants property
    const eventEntity = event as EventEntity;

    eventEntity.participants = eventEntity.participants.filter(participant => participant !== userEmail);
    return eventEntity.save();
  }
}
