import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TestsService } from './tests.service';
import { PrismaService } from '../common/prisma.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(private service: TestsService, private prisma: PrismaService) {}

  @Get('templates')
  listTemplates() {
    return this.prisma.testTemplate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post(':testId/submit')
  submit(@Param('testId') testId: string, @Body() body: { answers: any[] }) {
    return this.service.submit(testId, body.answers);
  }
}
