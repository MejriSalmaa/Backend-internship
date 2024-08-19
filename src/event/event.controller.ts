/* eslint-disable prettier/prettier */

import { Controller, Post, Body, Request, UseGuards, Patch, Param, NotFoundException, Delete, Get, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { UserService } from '../user/user.service';
//import { GetUser } from '../common/decorators/get-user.decorator'; // Import the custom decorator
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { EventEntity } from './event.entity';
import { EventCategory } from './EventCategory.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) { }
  @Post('/create')
  @UseGuards(JwtAuthGuard) // Ensure the user is logged in
  @ApiBearerAuth()

  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    // Assuming the user's email is stored in req.user.email
    const user = req.user.email;

    return this.eventService.createEvent(createEventDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ): Promise<EventEntity> {
    const userEmail = req.user.email;

    const event = await this.eventService.updateEvent(id, updateEventDto, userEmail);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }
  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  async remove(@Param('id') id: string, @Request() req): Promise<{ deleted: boolean }> {
    const userEmail = req.user.email;


    return this.eventService.remove(id, userEmail);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<EventEntity[]> {
    return this.eventService.findAll();
  }
  @Get('categories')
  getCategories() {
    return Object.values(EventCategory);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  @Get('search')

  async searchEvents(@Query('query') query: string) {
    return this.eventService.searchEvents(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  @Get('past-participated')
  async getPastParticipatedEvents(@Request() req) {
    const userEmail = req.user.email; // Assuming JWT payload contains email
    return await this.eventService.getPastEventsForParticipant(userEmail);
  }
}