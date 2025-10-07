import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Roles, RolesGuard } from '../common/roles.guard';

@Controller('admin/posts')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminPostsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() { return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } }); }
  @Post()
  create(@Body() body: any) { return this.prisma.post.create({ data: body }); }
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.prisma.post.update({ where: { id }, data: body }); }
  @Delete(':id')
  remove(@Param('id') id: string) { return this.prisma.post.delete({ where: { id } }); }
}
