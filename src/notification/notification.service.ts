import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    // Fetch notifications and filter out past events
    const notifications = await this.notificationModel.find({ user: userEmail }).exec();
    return notifications.filter(async (notification) => {
      if (notification.eventId) {
        const event = await this.eventModel.findById(notification.eventId).exec();
        if (event && new Date(event.startDate) > new Date()) {
          return true;
        }
      }
      return false;
    });
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true }).exec();
  }

  async getUnreadNotificationCount(userEmail: string): Promise<number> {
    const notifications = await this.notificationModel.find({ user: userEmail, isRead: false }).exec();
    const count = notifications.filter(async (notification) => {
      if (notification.eventId) {
        const event = await this.eventModel.findById(notification.eventId).exec();
        if (event && new Date(event.startDate) > new Date()) {
          return true;
        }
      }
      return false;
    }).length;
    return count;
  }

  async removeParticipantFromEvent(eventId: string, userEmail: string): Promise<EventEntity> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if the event date has passed
    if (new Date(event.startDate) <= new Date()) {
      // Automatically remove the participant if the event has passed
      event.participants = event.participants.filter(participant => participant !== userEmail);
      await event.save();

      // Automatically mark the notification as read
      const notifications = await this.notificationModel.find({ event: eventId, user: userEmail }).exec();
      for (const notification of notifications) {
        notification.isRead = true;
        await notification.save();
      }

      return event;
    }

    // Cast event to EventEntity to access the participants property
    const eventEntity = event as EventEntity;

    eventEntity.participants = eventEntity.participants.filter(participant => participant !== userEmail);
    return eventEntity.save();
  }

  async markAllNotificationsAsRead(userEmail: string): Promise<void> {
    // Mark notifications as read only if the event is not in the past
    const notifications = await this.notificationModel.find({ user: userEmail, isRead: false }).exec();
    for (const notification of notifications) {
      if (notification.eventId) {
        const event = await this.eventModel.findById(notification.eventId).exec();
        if (event && new Date(event.startDate) > new Date()) {
          await this.notificationModel.findByIdAndUpdate(notification._id, { isRead: true }).exec();
        } else {
          // If the event is past, mark the notification as read and remove the participant
          await this.removeParticipantFromEvent(notification.eventId, userEmail);
        }
      }
    }
  }
}
