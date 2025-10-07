import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(actorId: string | null, action: string, entity: string, entityId?: string, diff?: any) {
    await this.prisma.log.create({ data: { actorId: actorId || undefined, action, entity, entityId, diff } });
  }
}
