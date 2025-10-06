import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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

  @Post('testimonials/:id/approve')
  approveTestimonial(@Param('id') id: string) {
    return this.prisma.testimonial.update({ where: { id }, data: { approved: true } });
  }
}
