import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('unionMembershipNumber') unionNumber: string,
    @Body('identityCardNumber') idCardNumber: string,
  ) {
    return this.authService.loginWithCard(unionNumber, idCardNumber);
  }
}
