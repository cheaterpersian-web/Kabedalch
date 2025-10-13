import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { TestResultsController } from './test-results.controller';
import { PrismaService } from '../common/prisma.service';
import { TelegramService } from '../common/telegram.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  providers: [TestsService, PrismaService, TelegramService],
  controllers: [TestsController, TestResultsController],
})
export class TestsModule {}
