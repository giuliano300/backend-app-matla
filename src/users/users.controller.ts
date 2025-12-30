import { Controller, Get, Patch, Body, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('me')
  async me(@User('userId') userId: string) {
    try {
      console.log('Richiesta /users/me, userId:', userId);
      const user = await this.usersService.findById(userId);
      console.log('Utente trovato:', user);
      return user;
    } 
    catch (err) 
    {
      console.error('Errore in /users/me:', err);
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/phone')
  updatePhone(
    @User('userId') userId: string,
    @Body() dto: UpdatePhoneDto,
  ) {
    return this.usersService.setPhone(userId, dto.phone);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/email')
  updateEmail(
    @User('userId') userId: string,
    @Body() dto: UpdateEmailDto,
  ) {
    return this.usersService.setEmail(userId, dto.email);
  }
}
