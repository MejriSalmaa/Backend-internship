import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hash } from 'bcrypt';

@Schema()
export class UserEntity extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  picture: string;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);

UserEntitySchema.pre<UserEntity>('save', async function (next: Function) {
  this.password = await hash(this.password, 10);
  next();
});
