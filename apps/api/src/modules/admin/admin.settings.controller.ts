import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
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
    const value = body?.value ?? null;
    await this.prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
    return { ok: true };
  }
}
