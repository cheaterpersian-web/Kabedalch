import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CryptoService } from '../common/crypto.service';

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) {}

  async request(input: {
    name: string;
    phone: string;
    email?: string;
    description: string;
    preferredTime?: string;
  }) {
    const masked = this.maskPhone(input.phone);
    const encrypted = this.crypto.encrypt(input.phone);
    const c = await this.prisma.consultation.create({
      data: {
        name: input.name,
        phoneMasked: masked,
        phoneFullEncrypted: encrypted,
        email: input.email,
        description: input.description,
        preferredTime: input.preferredTime,
      },
    });
    return { id: c.id };
  }

  private maskPhone(phone: string) {
    if (phone.length < 4) return '****';
    const head = phone.slice(0, 3);
    const tail = phone.slice(-3);
    return `${head}******${tail}`;
  }
}
