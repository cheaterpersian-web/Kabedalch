import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from './redis.service';
import { RateLimiterRedis } from 'rate-limiter-flexible';

export const RATE_LIMIT_KEY = 'rate_limit';
export const RateLimit = (points = 10, duration = 60) => SetMetadata(RATE_LIMIT_KEY, { points, duration });

@Injectable()
export class RateLimitGuard implements CanActivate {
  private limiter: RateLimiterRedis;

  constructor(private reflector: Reflector, redis: RedisService) {
    this.limiter = new RateLimiterRedis({
      storeClient: redis.getClient(),
      points: 100,
      duration: 60,
      keyPrefix: 'rlf',
    });
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const cfg = this.reflector.getAllAndOverride<{ points: number; duration: number }>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const key = `${req.ip}:${req.route?.path}`;
    const points = cfg?.points ?? 100;
    const duration = cfg?.duration ?? 60;
    try {
      await this.limiter.consume(key, 1, { customDuration: duration, customPoints: points });
      return true;
    } catch {
      return false;
    }
  }
}
