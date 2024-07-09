/* eslint-disable prettier/prettier */

import { Controller} from '@nestjs/common';
import { EventService } from './event.service';
import { UserService } from '../user/user.service';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

 
}