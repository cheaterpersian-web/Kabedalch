import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from '../common/roles.guard';
import { AuditService } from '../common/audit.service';

@ApiTags('admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  @Get('dashboard')
  async dashboard() {
    const [users, orders, tests, messages] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.testResult.count(),
      this.prisma.consultation.count(),
    ]);
    return { users, orders, tests, messages };
  }

  @Post('packages')
  async createPackage(@Body() body: any) {
    const p = await this.prisma.package.create({ data: body });
    await this.audit.log(null, 'create', 'package', p.id, body);
    return p;
  }

  @Patch('packages/:id')
  async updatePackage(@Param('id') id: string, @Body() body: any) {
    const p = await this.prisma.package.update({ where: { id }, data: body });
    await this.audit.log(null, 'update', 'package', id, body);
    return p;
  }

  @Get('packages')
  listPackages() {
    return this.prisma.package.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Delete('packages/:id')
  async deletePackage(@Param('id') id: string) {
    const p = await this.prisma.package.delete({ where: { id } });
    await this.audit.log(null, 'delete', 'package', id);
    return p;
  }

  @Post('testimonials/:id/approve')
  approveTestimonial(@Param('id') id: string) {
    return this.prisma.testimonial.update({ where: { id }, data: { approved: true } });
  }

  @Get('testimonials/pending')
  pendingTestimonials() {
    return this.prisma.testimonial.findMany({ where: { approved: false }, orderBy: { createdAt: 'desc' } });
  }

  @Post('testimonials/:id/reject')
  rejectTestimonial(@Param('id') id: string) {
    return this.prisma.testimonial.delete({ where: { id } });
  }

  @Get('orders')
  listOrders() {
    return this.prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Get('users')
  listUsers() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, family: true, email: true, phone: true, role: true, createdAt: true } });
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body() body: { role: 'user'|'admin'|'consultant' }) {
    return this.prisma.user.update({ where: { id }, data: { role: body.role } });
  }

  @Post('testimonials')
  createTestimonial(@Body() body: { userName: string; phoneMasked?: string; phoneFullEncrypted?: string; message: string; approved?: boolean }) {
    return this.prisma.testimonial.create({ data: { ...body, approved: body.approved ?? true } });
  }
}
