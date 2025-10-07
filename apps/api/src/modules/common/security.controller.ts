import { Controller, Get, Req } from '@nestjs/common';

@Controller('security')
export class SecurityController {
  @Get('csrf-token')
  getToken(@Req() req: any) {
    const token = typeof req.csrfToken === 'function' ? req.csrfToken() : null;
    return { csrfToken: token };
  }
}
