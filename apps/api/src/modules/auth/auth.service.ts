import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async register(input: {
    name: string;
    family: string;
    phone: string;
    email: string;
    password: string;
  }) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ email: input.email }, { phone: input.phone }] } });
    if (exists) throw new UnauthorizedException('کاربر موجود است');
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: { name: input.name, family: input.family, phone: input.phone, email: input.email, passwordHash },
    });
    return { id: user.id };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role });
    const refreshToken = await this.jwt.signAsync({ sub: user.id, type: 'refresh' }, { expiresIn: '7d' });
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    const requires2fa = !!user.totpSecret;
    return { accessToken, refreshToken, requires2fa };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshTokenHash) throw new UnauthorizedException('نامعتبر');
    const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!ok) throw new UnauthorizedException('نامعتبر');
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { accessToken };
  }

  async refreshWithToken(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET || 'dev-secret' });
      if (payload?.type !== 'refresh') throw new UnauthorizedException('نامعتبر');
      return this.refresh(payload.sub, refreshToken);
    } catch {
      throw new UnauthorizedException('نامعتبر');
    }
  }
}
