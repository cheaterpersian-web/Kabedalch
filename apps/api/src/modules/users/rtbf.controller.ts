import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Roles, RolesGuard } from '../common/roles.guard';

@Controller('admin/users')
@UseGuards(RolesGuard)
@Roles('admin')
export class RtbfController {
  constructor(private prisma: PrismaService) {}

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.prisma.testResult.deleteMany({ where: { userId: id } });
    await this.prisma.order.deleteMany({ where: { userId: id } });
    await this.prisma.post.deleteMany({ where: { authorId: id } });
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
