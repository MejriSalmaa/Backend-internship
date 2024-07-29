import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  isRead: boolean;

  @Prop({ required: true })
  eventId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
