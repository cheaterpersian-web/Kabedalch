import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private prisma: PrismaService) {}

  @Post('payment')
  async payment(@Body() body: any) {
    await this.prisma.webhook.create({ data: { provider: 'payment', payload: body, status: 'received' } });
    return { ok: true };
  }

  @Get('payment')
  async paymentSandbox(@Query('orderId') orderId?: string) {
    if (orderId) {
      await this.prisma.order.update({ where: { id: orderId }, data: { status: 'paid' } as any });
    }
    return { ok: true };
  }
}
