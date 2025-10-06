import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { PrismaService } from '../common/prisma.service';
import { CryptoService } from '../common/crypto.service';

@Module({
  providers: [TestimonialsService, PrismaService, CryptoService],
  controllers: [TestimonialsController],
})
export class TestimonialsModule {}
