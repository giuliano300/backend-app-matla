import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { DiscountType } from '../discount.schema';

export class CreateDiscountDto {

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsString()
  productName: string;

  @IsString()
  productImageBase64: string;

  @IsString()
  templateBase64: string;

  @IsNumber()
  cost: number;

  @IsString()
  code: string;

  // se assente → valido per tutti
  @IsOptional()
  @IsString()
  userId?: string;
}
