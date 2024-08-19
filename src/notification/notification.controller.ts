import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NotificationService } from './notification.service'; // Adjust the path as necessary
import { CreateNotificationDTO } from './dto/Notification.dto'; // Adjust the path as necessary
import { Notification } from './notification.entity'; // Adjust the path as necessary
import { EventEntity } from 'src/event/event.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';

@ApiTags('notifications')

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDTO: CreateNotificationDTO): Promise<Notification> {
    return this.notificationService.createNotification(createNotificationDTO);
  }

  @Get()
  async getUserNotifications(@Query('userEmail') userEmail: string): Promise<Notification[]> {
    return this.notificationService.getUserNotifications(userEmail);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.markNotificationAsRead(id);
  }

  @Get('unread-count')
  async getUnreadCount(@Query('userEmail') userEmail: string): Promise<number> {
    return this.notificationService.getUnreadNotificationCount(userEmail);
  }

  @Patch('events/:eventId/remove-participant')
  async removeParticipant(
    @Param('eventId') eventId: string,
    @Body('userEmail') userEmail: string,
  ): Promise<EventEntity> {
    return this.notificationService.removeParticipantFromEvent(eventId, userEmail);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Query('userEmail') userEmail: string): Promise<void> {
    return this.notificationService.markAllNotificationsAsRead(userEmail);
  }

 
}
