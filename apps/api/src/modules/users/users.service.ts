import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  me(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, family: true, email: true, phone: true, address: true, role: true } });
  }

  async deleteSelf(userId: string) {
    await this.prisma.testResult.deleteMany({ where: { userId } });
    await this.prisma.order.deleteMany({ where: { userId } });
    await this.prisma.post.deleteMany({ where: { authorId: userId } });
    await this.prisma.user.delete({ where: { id: userId } });
    return { ok: true };
  }

  myOrders(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { package: true } });
  }

  myTests(userId: string) {
    return this.prisma.testResult.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { test: true, recommendedPackage: true } });
  }

  updateMe(userId: string, data: { name?: string; family?: string; phone?: string; address?: string }) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }
}
