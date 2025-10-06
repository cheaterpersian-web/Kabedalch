import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { ApiTags } from '@nestjs/swagger';
import { RateLimit, RateLimitGuard } from '../common/rate-limit.guard';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private service: TestimonialsService) {}

  @Get()
  list() {
    return this.service.listApproved();
  }

  @Post()
  @UseGuards(RateLimitGuard)
  @RateLimit(5, 60)
  submit(@Body() body: { userName: string; phone: string; message: string; imageBeforeUrl?: string; imageAfterUrl?: string }) {
    return this.service.submit(body);
  }
}
