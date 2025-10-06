import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Post()
  create(@Body() body: { packageId: string }, @Req() req: any) {
    const userId = req.user?.sub || 'anonymous-user';
    return this.service.create(userId, body.packageId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Get('user/:userId')
  listByUser(@Param('userId') userId: string) {
    return this.service.listByUser(userId);
  }
}
