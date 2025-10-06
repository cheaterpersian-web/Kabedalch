import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() body: { packageId: string }) {
    const userId = req.user?.userId || body['userId'];
    return this.service.create(userId, body.packageId);
  }
}
