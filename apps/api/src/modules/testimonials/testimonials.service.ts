import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CryptoService } from '../common/crypto.service';
import { SettingsService } from '../settings/settings.service';
import { verifyHCaptcha } from '../common/hcaptcha';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService, private crypto: CryptoService, private settings: SettingsService) {}

  async listApproved() {
    const showFullPhone = !!(await this.settings.get('testimonials.showFullPhone'));
    let list = await this.prisma.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' } });
    // Fallback: if nothing approved yet, show recent pending ones
    if (list.length === 0) {
      list = await this.prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
    }
    // If database is empty, seed a demo approved testimonial to avoid empty UI
    if (list.length === 0) {
      const demo = await this.prisma.testimonial.create({
        data: {
          userName: 'کاربر نمونه',
          phoneMasked: '09*********',
          message: 'از خدمات بسیار راضی بودم. ممنون از تیم حرفه‌ای.',
          approved: true,
        },
      });
      list = [demo];
    }
    if (!showFullPhone) return list;
    return list.map((t: any) => ({
      ...t,
      phoneFull: t.phoneFullEncrypted ? this.crypto.decrypt(t.phoneFullEncrypted) : null,
    }));
  }

  async submit(input: { userName: string; phone: string; message: string; imageBeforeUrl?: string; imageAfterUrl?: string; videoUrl?: string; hcaptchaToken?: string }) {
    const ok = await verifyHCaptcha(input.hcaptchaToken);
    if (!ok) return { ok: false, error: 'captcha' };
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
        videoUrl: input.videoUrl,
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
