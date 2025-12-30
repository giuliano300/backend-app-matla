import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount, DiscountDocument } from './discount.schema';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectModel(Discount.name)
    private discountModel: Model<DiscountDocument>,
  ) {}

  async create(dto: CreateDiscountDto) {
    const exists = await this.discountModel.findOne({ code: dto.code });
    if (exists) throw new ConflictException('Codice sconto già esistente');

    return this.discountModel.create(dto);
  }

  // Tutti gli sconti visibili a un utente
  async findForUser(userId: string) {
    return this.discountModel.find({
      $or: [
        { userId: null },
        { userId },
      ],
      expiresAt: { $gte: new Date() }
    });
  }

  async findAll() {
    return this.discountModel.find();
  }

  async findById(id: string) {
    const discount = await this.discountModel.findById(id);
    if (!discount) throw new NotFoundException('Sconto non trovato');
    return discount;
  }

  async useDiscount(discountId: string, userId: string) {
    const discount = await this.discountModel.findById(discountId);

    if (!discount) throw new NotFoundException();
    if (discount.expiresAt < new Date())
      throw new ConflictException('Sconto scaduto');

    if (discount.singleUse && discount.usedBy.includes(userId as any))
      throw new ConflictException('Sconto già usato');

    discount.usedBy.push(userId as any);
    return discount.save();
  }
}
