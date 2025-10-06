import { Body, Controller, Post } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/jwt-auth.guard';
import { RateLimit, RateLimitGuard } from '../common/rate-limit.guard';
import { verifyHCaptcha } from '../common/hcaptcha';

@ApiTags('consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private service: ConsultationsService) {}

  @Post()
  @Public()
  @RateLimit(5, 60)
  request(
    @Body()
    body: { name: string; phone: string; email?: string; description: string; preferredTime?: string; hcaptchaToken?: string },
  ) {
    return verifyHCaptcha(body.hcaptchaToken).then((ok) => (ok ? this.service.request(body) : { ok: false, error: 'captcha' }));
  }
}
