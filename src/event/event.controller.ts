/* eslint-disable prettier/prettier */

import { Controller, Post, Body, Request,UseGuards ,Patch,Param,NotFoundException,Delete, Get} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { UserService } from '../user/user.service';
//import { GetUser } from '../common/decorators/get-user.decorator'; // Import the custom decorator
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { EventEntity } from './event.entity';
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}
@Post('/create')
@UseGuards(JwtAuthGuard) // Ensure the user is logged in

async create(@Body() createEventDto: CreateEventDto , @Request() req ) {
  // Assuming the user's email is stored in req.user.email
  const user = req.user.email;

  return this.eventService.createEvent(createEventDto ,user );
}

@Patch('/update/:id')
@UseGuards(JwtAuthGuard) // Ensure the user is logged in
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ): Promise<EventEntity> {
    // Assuming you want to ensure the user is authorized to update the event
    const event = await this.eventService.updateEvent(id, updateEventDto);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }
  
  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req): Promise<{ deleted: boolean }> {
    const userEmail = req.user.email;
    

    return this.eventService.remove(id, userEmail);
  }

  @Get()
  async findAll(): Promise<EventEntity[]> {
    return this.eventService.findAll();
  }
}