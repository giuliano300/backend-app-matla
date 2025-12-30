import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Role } from 'src/enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async refreshToken(userId: string) {
    const user = await this.usersService.findById(userId);

    const payload = {
      sub: user?._id,
      role: Role.USER
    };

    return {
      token: this.jwtService.sign(payload),
      registrationStep: user?.registrationStep,
    };
  }  

  async loginWithCard(unionNumber: string, idCardNumber: string) {
    // Check if the user exists
    const user = await this.usersService.findByUnionAndIdCard(
      unionNumber,
      idCardNumber,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { 
      sub: user._id.toString(),
      role: Role.USER
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      registrationStep: user.registrationStep,
    };
  }
}
