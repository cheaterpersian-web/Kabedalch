import { Controller, Get, Param } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  constructor(private service: PackagesService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
