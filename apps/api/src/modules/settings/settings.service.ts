import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get(key: string) {
    const st = await this.prisma.setting.findUnique({ where: { key } });
    return st?.value ?? null;
  }
}
