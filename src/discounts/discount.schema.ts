import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DiscountDocument = Discount & Document;

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

@Schema({ timestamps: true })
export class Discount {

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true, enum: DiscountType })
  discountType: DiscountType;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productImageBase64: string;

  @Prop({ required: true })
  templateBase64: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true, unique: true })
  code: string;

  // null = valido per tutti
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  singleUse: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  usedBy: Types.ObjectId[];
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
