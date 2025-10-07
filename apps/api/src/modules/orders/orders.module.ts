import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from '../common/prisma.service';
import { AghaPardakhtService } from './agha-pardakht.service';
import { SettingsService } from '../settings/settings.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, AghaPardakhtService, SettingsService],
})
export class OrdersModule {}
