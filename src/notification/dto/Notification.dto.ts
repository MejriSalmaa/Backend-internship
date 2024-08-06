import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDTO {
  @ApiProperty({ description: 'The user associated with the notification' })
  @IsNotEmpty()
  @IsString()
  readonly user: string;

  @ApiProperty({ description: 'The message content of the notification' })
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({ description: 'Indicates whether the notification has been read', default: false })
  @IsNotEmpty()
  @IsBoolean()
  readonly isRead: boolean;

  @ApiProperty({ description: 'The ID of the event associated with the notification' })
  @IsNotEmpty()
  @IsString()
  readonly eventId: string;
}
