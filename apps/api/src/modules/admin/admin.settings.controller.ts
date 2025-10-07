import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Roles, RolesGuard } from '../common/roles.guard';

@Controller('admin/settings')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminSettingsController {
  constructor(private prisma: PrismaService) {}

  @Get(':key')
  async get(@Param('key') key: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  @Patch(':key')
  async set(@Param('key') key: string, @Body() body: any) {
    const raw = body?.value ?? null;
    let value: any = raw;
    if (typeof raw === 'string') {
      try { value = JSON.parse(raw); } catch { if (raw === 'true') value = true; else if (raw === 'false') value = false; }
    }
    await this.prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    return { ok: true };
  }

  @Post(':key')
  async setPost(@Param('key') key: string, @Body() body: any) {
    return this.set(key, body);
  }
}
