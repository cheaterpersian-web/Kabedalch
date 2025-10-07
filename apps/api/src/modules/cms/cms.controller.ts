import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Roles, RolesGuard } from '../common/roles.guard';

@Controller('admin/cms')
@UseGuards(RolesGuard)
@Roles('admin')
export class CmsController {
  constructor(private prisma: PrismaService) {}

  @Get('pages')
  listPages() { return this.prisma.page.findMany({ orderBy: { createdAt: 'desc' } }); }
  @Post('pages')
  createPage(@Body() body: any) { return this.prisma.page.create({ data: body }); }
  @Patch('pages/:id')
  updatePage(@Param('id') id: string, @Body() body: any) { return this.prisma.page.update({ where: { id }, data: body }); }
  @Delete('pages/:id')
  deletePage(@Param('id') id: string) { return this.prisma.page.delete({ where: { id } }); }

  @Get('faqs')
  listFaqs() { return this.prisma.fAQ.findMany({ orderBy: { createdAt: 'desc' } }); }
  @Post('faqs')
  createFaq(@Body() body: any) { return this.prisma.fAQ.create({ data: body }); }
  @Patch('faqs/:id')
  updateFaq(@Param('id') id: string, @Body() body: any) { return this.prisma.fAQ.update({ where: { id }, data: body }); }
  @Delete('faqs/:id')
  deleteFaq(@Param('id') id: string) { return this.prisma.fAQ.delete({ where: { id } }); }

  @Get('sliders')
  listSliders() { return this.prisma.slider.findMany({ orderBy: { createdAt: 'desc' } }); }
  @Post('sliders')
  createSlider(@Body() body: any) { return this.prisma.slider.create({ data: body }); }
  @Patch('sliders/:id')
  updateSlider(@Param('id') id: string, @Body() body: any) { return this.prisma.slider.update({ where: { id }, data: body }); }
  @Delete('sliders/:id')
  deleteSlider(@Param('id') id: string) { return this.prisma.slider.delete({ where: { id } }); }
}
