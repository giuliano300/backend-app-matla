import { IsString, Matches } from 'class-validator';

export class UpdatePhoneDto {
  @IsString()
  @Matches(/^\+\d{8,15}$/)
  phone: string;
}
