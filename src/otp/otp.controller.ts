import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { OtpService } from './otp.service';
import { OtpType } from './otp.schema';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthService } from 'src/auth/auth.service';

@UseGuards(JwtAuthGuard)
@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService, private authService: AuthService) {}

    // 📲 OTP CELLULARE (OBBLIGATORIO)
    @Post('phone/send')
    sendPhone(@User('userId') userId: string, @Body('phone') phone: string) {
        return this.otpService.sendOtp(userId, OtpType.PHONE, phone);
    }
    
    // 📧 OTP EMAIL (FACOLTATIVO)
    @Post('email/send')
    sendEmail(@User('userId') userId: string, @Body('email') email: string) {
        return this.otpService.sendOtp(userId, OtpType.EMAIL, email);
    }

    @Post('email/verify')
    verifyEmail(@User('userId') userId: string, @Body() dto: VerifyOtpDto) {
        return this.otpService.verifyOtp(userId, OtpType.EMAIL, dto.code);
    }

    @Post('phone/verify')
    async verifyPhone(  
    @User('userId') userId: string,
    @Body() dto: VerifyOtpDto,
    ) {
        const result = await this.otpService.verifyOtp(userId, OtpType.PHONE, dto.code);
        return this.authService.refreshToken(userId);
    }
}
