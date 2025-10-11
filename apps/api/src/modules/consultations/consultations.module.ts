import { Module } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { PrismaService } from '../common/prisma.service';
import { CryptoService } from '../common/crypto.service';
import { SettingsModule } from '../settings/settings.module';
import { TelegramService } from '../common/telegram.service';

@Module({
  imports: [SettingsModule],
  controllers: [ConsultationsController],
  providers: [ConsultationsService, PrismaService, CryptoService, TelegramService],
})
export class ConsultationsModule {}
