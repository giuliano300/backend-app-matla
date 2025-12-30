import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/enum';

export enum RegistrationStep {
  START = 'START',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  unionMembershipNumber: string;

  @Prop({ required: true })
  identityCardNumber: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({
    enum: RegistrationStep,
    default: RegistrationStep.START,
  })
  registrationStep: RegistrationStep;

  @Prop({ enum: Role, default: Role.USER })
  role: Role;
}

// ✅ Creiamo il tipo UserDocument per NestJS/Mongoose
export type UserDocument = User & Document;

// Schema Mongoose
export const UserSchema = SchemaFactory.createForClass(User);
