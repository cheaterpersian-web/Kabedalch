import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [TestsService, PrismaService],
  controllers: [TestsController],
})
export class TestsModule {}
