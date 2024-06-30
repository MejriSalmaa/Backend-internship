import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hash } from 'bcrypt';

// Define the Role enumeration
enum Role {
  Admin = 'admin',
  User = 'user',
}

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

  // Add the etat attribute with a default value of false
  @Prop({ default: false })
  etat: boolean;

  // Add the role attribute using the Role enum
  @Prop({ enum: Role, default: Role.User })
  role: Role;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);

UserEntitySchema.pre<UserEntity>('save', async function (next: Function) {
  this.password = await hash(this.password, 10);
  next();
});