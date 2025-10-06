import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.package.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.package.findUnique({ where: { id } });
  }
}
