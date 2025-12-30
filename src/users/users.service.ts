import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegistrationStep, User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // Trova utente per ID
  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  // Crea nuovo utente
  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  // Imposta il numero di telefono e aggiorna il passo di registrazione
  async setPhone(userId: string, phone: string) {
    const exists = await this.userModel.findOne({ phone });
    if (exists) throw new ConflictException('Telefono già in uso');

    return this.userModel.findByIdAndUpdate(
      userId,
      { 
        phone, 
        phoneVerified: false, 
        registrationStep: RegistrationStep.PHONE 
      },
      { new: true },
    );
  }

  // Imposta l'email e aggiorna il passo di registrazione
  async setEmail(userId: string, email: string) {
    const exists = await this.userModel.findOne({ email });
    if (exists) throw new ConflictException('Email già in uso');

    return this.userModel.findByIdAndUpdate(
      userId,
      { 
        email, 
        emailVerified: false, 
        registrationStep: RegistrationStep.EMAIL 
      },
      { new: true },
    );
  }

  // Aggiorna lo stato dopo la verifica del telefono
  async updateAfterPhoneVerification(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        phoneVerified: true,
        registrationStep: RegistrationStep.EMAIL, // passo successivo: email (opzionale)
      },
      { new: true },
    );
  }

  // Aggiorna lo stato dopo la verifica dell'email
  async updateAfterEmailVerification(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        emailVerified: true,
        registrationStep: RegistrationStep.COMPLETED,
      },
      { new: true },
    );
  }

  // Segna la registrazione come completata (per utenti senza email)
  async markCompleted(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { registrationStep: RegistrationStep.COMPLETED },
      { new: true },
    );
  }

  // Trova utente tramite numero iscrizione sindacato e numero carta d'identità
  async findByUnionAndIdCard(unionNumber: string, idCardNumber: string) {
    return this.userModel.findOne({
      unionMembershipNumber: unionNumber,
      identityCardNumber: idCardNumber,
    });
  }
}
