import { Body, Controller, ForbiddenException, Get, Param, Post, Req } from '@nestjs/common';
import { TestsService } from './tests.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(private service: TestsService) {}

  @Get('templates')
  listTemplates() {
    return this.service.listTemplates();
  }

  @Post(':testId/submit')
  submit(
    @Param('testId') testId: string,
    @Body() body: { answers: Record<string, any> },
    @Req() req: any,
  ) {
    const userId: string | undefined = req.user?.sub;
    return this.service.submit(testId, body, userId);
  }

  @Get('results/:userId')
  results(@Param('userId') userId: string, @Req() req: any) {
    const caller = req.user;
    if (!caller || (caller.sub !== userId && caller.role !== 'admin')) throw new ForbiddenException();
    return this.service.resultsForUser(userId);
  }
}
