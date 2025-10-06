import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { PrismaService } from '../common/prisma.service';
import { CryptoService } from '../common/crypto.service';
import { RedisService } from '../common/redis.service';
import { RateLimitGuard } from '../common/rate-limit.guard';
import { SettingsService } from '../settings/settings.service';

@Module({
  providers: [TestimonialsService, PrismaService, CryptoService, RedisService, RateLimitGuard, SettingsService],
  controllers: [TestimonialsController],
})
export class TestimonialsModule {}
