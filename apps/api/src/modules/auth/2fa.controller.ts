import { Body, Controller, Post, Req } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { authenticator } from 'otplib';

@Controller('auth/2fa')
export class TwoFaController {
  constructor(private prisma: PrismaService) {}

  @Post('setup')
  async setup(@Req() req: any) {
    const userId = req.user?.sub as string;
    const secret = authenticator.generateSecret();
    await this.prisma.user.update({ where: { id: userId }, data: { totpSecret: secret } });
    const otpauth = authenticator.keyuri(req.user?.email || userId, 'LiverAlcoholCenter', secret);
    return { secret, otpauth };
  }

  @Post('verify')
  async verify(@Req() req: any, @Body() body: { token: string }) {
    const userId = req.user?.sub as string;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.totpSecret) return { ok: false };
    const ok = authenticator.verify({ token: body.token, secret: user.totpSecret });
    return { ok };
  }
}
