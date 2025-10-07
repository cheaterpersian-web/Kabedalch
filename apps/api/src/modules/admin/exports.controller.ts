import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Response } from 'express';

@Controller('admin/exports')
export class ExportsController {
  constructor(private prisma: PrismaService) {}

  @Get(':entity.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportCsv(@Param('entity') entity: string, @Res() res: Response) {
    const map: Record<string, () => Promise<any[]>> = {
      users: () => this.prisma.user.findMany(),
      orders: () => this.prisma.order.findMany(),
      results: () => this.prisma.testResult.findMany(),
    };
    const loader = map[entity];
    if (!loader) return res.status(404).send('Not found');
    const rows = await loader();
    const keys = rows.length ? Object.keys(rows[0]) : [];
    const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => JSON.stringify((r as any)[k] ?? '')).join(','))].join('\n');
    res.send(csv);
  }
}
