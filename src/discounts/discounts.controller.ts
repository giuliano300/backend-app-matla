import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { Response } from 'express';
import { Res } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  // ADMIN
  @Post()
  create(@Body() dto: CreateDiscountDto) {
    return this.discountsService.create(dto);
  }

  // Sconti per utente loggato
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  @Roles('USER')
  findMyDiscounts(@User('userId') userId: string) {
    return this.discountsService.findForUser(userId);
  }

  // Tutti (admin)
  @Get()
  findAll() {
    return this.discountsService.findAll();
  }

  @Get(':id/template')
  async download(@Param('id') id: string, @Res() res: Response) {
    const discount = await this.discountsService.findById(id);
    const buffer = Buffer.from(discount.templateBase64, 'base64');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="sconto.pdf"',
    });

    res.send(buffer);
  }
}
