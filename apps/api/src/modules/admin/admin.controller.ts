import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from '../common/roles.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

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
  createPackage(@Body() body: any) {
    return this.prisma.package.create({ data: body });
  }

  @Patch('packages/:id')
  updatePackage(@Param('id') id: string, @Body() body: any) {
    return this.prisma.package.update({ where: { id }, data: body });
  }

  @Get('packages')
  listPackages() {
    return this.prisma.package.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Delete('packages/:id')
  deletePackage(@Param('id') id: string) {
    return this.prisma.package.delete({ where: { id } });
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
}
