import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './otp.schema';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    UsersModule,
    AuthModule
  ],
  providers: [OtpService],
  controllers: [OtpController],
})
export class OtpModule {}
