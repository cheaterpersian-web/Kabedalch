import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

  async list() {
    const client = this.redis.getClient();
    const cached = await client.get('packages:list');
    if (cached) return JSON.parse(cached);
    const data = await this.prisma.package.findMany({ orderBy: { createdAt: 'desc' } });
    await client.set('packages:list', JSON.stringify(data), 'EX', 60);
    return data;
  }

  findById(id: string) {
    return this.prisma.package.findUnique({ where: { id } });
  }
}
