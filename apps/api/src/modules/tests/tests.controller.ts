import { Body, Controller, ForbiddenException, Get, Param, Post, Req } from '@nestjs/common';
import { Public } from '../common/jwt-auth.guard';
import { TestsService } from './tests.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(private service: TestsService) {}

  @Get('templates')
  @Public()
  listTemplates() {
    return this.service.listTemplates();
  }

  @Post(':testId/submit')
  @Public()
  submit(
    @Param('testId') testId: string,
    @Body() body: { answers: Record<string, any> },
    @Req() req: any,
  ) {
    const userId: string | undefined = req.user?.sub;
    return this.service.submit(testId, body, userId);
  }

  @Get(':testId')
  @Public()
  async getTemplate(@Param('testId') testId: string) {
    return this.service.findTemplateOrFirst(testId);
  }

  @Get('results/:userId')
  results(@Param('userId') userId: string, @Req() req: any) {
    const caller = req.user;
    if (!caller || (caller.sub !== userId && caller.role !== 'admin')) throw new ForbiddenException();
    return this.service.resultsForUser(userId);
  }
}
