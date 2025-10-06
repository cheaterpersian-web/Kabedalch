import { Body, Controller, Post } from '@nestjs/common';
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
}
