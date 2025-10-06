import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Roles, RolesGuard } from '../common/roles.guard';

@Controller('admin/tests')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminTestsController {
  constructor(private prisma: PrismaService) {}

  @Get('templates')
  listTemplates() { return this.prisma.testTemplate.findMany(); }

  @Post('templates')
  createTemplate(@Body() body: any) { return this.prisma.testTemplate.create({ data: body }); }

  @Patch('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() body: any) {
    return this.prisma.testTemplate.update({ where: { id }, data: body });
  }
}
