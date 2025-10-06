import { Body, Controller, Post } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/jwt-auth.guard';

@ApiTags('consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private service: ConsultationsService) {}

  @Post()
  @Public()
  request(@Body() body: { name: string; phone: string; email?: string; description: string; preferredTime?: string }) {
    return this.service.request(body);
  }
}
