/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OtpDocument = Otp & Document;

export enum OtpType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}

@Schema({ timestamps: true })
export class Otp {

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ enum: OtpType, index: true })
  type: OtpType;

  @Prop({ required: true })
  target: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, index: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  attempts: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// TTL index → cancella OTP scaduti
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
