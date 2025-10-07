import { Module } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { PrismaService } from '../common/prisma.service';
import { CryptoService } from '../common/crypto.service';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService, PrismaService, CryptoService],
})
export class ConsultationsModule {}
