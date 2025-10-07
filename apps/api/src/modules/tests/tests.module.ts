import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { TestResultsController } from './test-results.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [TestsService, PrismaService],
  controllers: [TestsController, TestResultsController],
})
export class TestsModule {}
