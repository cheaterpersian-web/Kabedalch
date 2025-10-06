import { Controller, Get, Param, Req } from '@nestjs/common';
import { TestsService } from './tests.service';

@Controller('test-results')
export class TestResultsController {
  constructor(private service: TestsService) {}

  @Get(':userId')
  results(@Param('userId') userId: string, @Req() req: any) {
    const caller = req.user;
    if (!caller || (caller.sub !== userId && caller.role !== 'admin')) return [];
    return this.service.resultsForUser(userId);
  }
}
