import { Controller, Get, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private service: SettingsService) {}

  @Get(':key')
  get(@Param('key') key: string) {
    return this.service.get(key);
  }
}
