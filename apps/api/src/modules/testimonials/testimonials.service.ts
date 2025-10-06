import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CryptoService } from '../common/crypto.service';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) {}

  listApproved() {
    return this.prisma.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' } });
  }

  async submit(input: { userName: string; phone: string; message: string; imageBeforeUrl?: string; imageAfterUrl?: string }) {
    const phoneMasked = this.maskPhone(input.phone);
    const phoneFullEncrypted = input.phone ? this.crypto.encrypt(input.phone) : undefined;
    const t = await this.prisma.testimonial.create({
      data: {
        userName: input.userName,
        phoneMasked,
        phoneFullEncrypted,
        message: input.message,
        imageBeforeUrl: input.imageBeforeUrl,
        imageAfterUrl: input.imageAfterUrl,
        approved: false,
      },
    });
    return { id: t.id };
  }

  private maskPhone(phone: string) {
    if (!phone) return '';
    if (phone.length < 4) return '****';
    return `${phone.slice(0, 3)}******${phone.slice(-3)}`;
  }
}
