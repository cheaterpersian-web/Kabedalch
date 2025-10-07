import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from '../common/prisma.service';
import { AghaPardakhtService } from './agha-pardakht.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, AghaPardakhtService],
})
export class OrdersModule {}
