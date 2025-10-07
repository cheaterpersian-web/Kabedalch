import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { AghaPardakhtService } from '../orders/agha-pardakht.service';
import { SettingsService } from '../settings/settings.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private prisma: PrismaService, private agha: AghaPardakhtService, private settings: SettingsService) {}

  @Post('payment')
  async payment(@Body() body: any) {
    const res = await this.agha.verifyPayment(body);
    await this.prisma.webhook.create({ data: { provider: 'agha', payload: body, status: res.ok ? 'ok' : 'fail' } });
    if (res.ok && res.orderId) {
      await this.prisma.order.update({ where: { id: res.orderId }, data: { status: 'paid' } as any });
    }
    return { ok: res.ok };
  }

  @Get('payment')
  async paymentSandbox(@Query('orderId') orderId?: string) {
    if (orderId) {
      await this.prisma.order.update({ where: { id: orderId }, data: { status: 'paid' } as any });
    }
    return { ok: true };
  }
}
