import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

@Module({
  providers: [PackagesService, PrismaService, RedisService],
  controllers: [PackagesController],
  exports: [PackagesService],
})
export class PackagesModule {}
