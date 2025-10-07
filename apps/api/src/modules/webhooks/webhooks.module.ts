import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { PrismaService } from '../common/prisma.service';
import { AghaPardakhtService } from '../orders/agha-pardakht.service';
import { SettingsService } from '../settings/settings.service';

@Module({
  controllers: [WebhooksController],
  providers: [PrismaService, AghaPardakhtService, SettingsService],
})
export class WebhooksModule {}
