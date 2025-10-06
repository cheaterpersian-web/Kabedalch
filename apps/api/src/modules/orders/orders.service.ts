import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, packageId: string) {
    const pkg = await this.prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) throw new Error('package not found');
    const order = await this.prisma.order.create({
      data: {
        userId,
        packageId,
        amountIRR: pkg.priceIRR - (pkg.discountIRR || 0),
        metadata: {},
      },
    });
    // TODO: integrate gateway (Zarinpal, etc.) and return payment_url
    return { id: order.id, payment_url: `https://example-gateway/pay/${order.id}` };
  }

  getById(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  listByUser(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }
}
