import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument, OtpType } from './otp.schema';
import { UsersService } from '../users/users.service';

const OTP_EXPIRATION_MINUTES = 5;
const MAX_ATTEMPTS = 5;

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private usersService: UsersService,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(userId: string, type: OtpType, target: string) {
    // invalida OTP precedenti
    await this.otpModel.deleteMany({ userId, type });

    const otp = await this.otpModel.create({
      userId,
      type,
      target,
      code: this.generateCode(),
      expiresAt: new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60000),
    });

    // TODO: integra provider reale (Twilio / Email)
    console.log(`OTP ${type} → ${target}: ${otp.code}`);

    return { success: true };
  }

    async verifyOtp(userId: string, type: OtpType, code: string) {
    const otp = await this.otpModel.findOne({ userId, type });
    if (!otp) throw new BadRequestException('OTP non valido');

    if (otp.expiresAt < new Date())
        throw new BadRequestException('OTP scaduto');

    if (otp.attempts >= MAX_ATTEMPTS)
        throw new ForbiddenException('Troppi tentativi');

    if (otp.code !== code) {
        otp.attempts++;
        await otp.save();
        throw new BadRequestException('Codice errato');
    }

    await otp.deleteOne();

    if (type === OtpType.PHONE) {
        const user = await this.usersService.updateAfterPhoneVerification(userId);

        // 🔥 se non ha email → COMPLETED
        if (!user?.email) {
        await this.usersService.markCompleted(userId);
        }
    }

    if (type === OtpType.EMAIL) {
        await this.usersService.updateAfterEmailVerification(userId);
    }

    return { verified: true };
    }
}
