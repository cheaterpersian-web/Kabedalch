import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../common/prisma.service';
import { ExportsController } from './exports.controller';

@Module({ controllers: [AdminController, ExportsController], providers: [PrismaService] })
export class AdminModule {}
