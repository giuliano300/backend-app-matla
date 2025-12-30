 import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';
import { DiscountsModule } from './discounts/discounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/mlt-app'),
    AuthModule,
    UsersModule,
    OtpModule,
    DiscountsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
