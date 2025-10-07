import { Controller, Get } from '@nestjs/common';
import { Public } from './common/jwt-auth.guard';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  ping() {
    return { ok: true };
  }
}
