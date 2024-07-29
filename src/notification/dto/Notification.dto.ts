import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDTO {
  @IsNotEmpty()
  @IsString()
  readonly user: string;

  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isRead: boolean;

  @IsNotEmpty()
  @IsString()
  readonly eventId: string;
}
