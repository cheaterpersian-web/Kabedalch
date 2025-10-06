import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../common/prisma.service';
import { CryptoService } from '../common/crypto.service';
import { RedisService } from '../common/redis.service';
import { RateLimitGuard } from '../common/rate-limit.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, CryptoService, JwtStrategy, RedisService, RateLimitGuard],
  exports: [AuthService],
})
export class AuthModule {}
