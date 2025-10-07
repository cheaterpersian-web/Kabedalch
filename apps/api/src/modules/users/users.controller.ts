import { Body, Controller, Delete, Get, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  me(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) return null;
    return this.service.me(userId);
  }

  @Get('me/orders')
  myOrders(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) return [];
    return this.service.myOrders(userId);
  }

  @Get('me/tests')
  myTests(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) return [];
    return this.service.myTests(userId);
  }

  @Patch('me')
  updateMe(@Req() req: any, @Body() body: { name?: string; family?: string; phone?: string; address?: string }) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) return null;
    return this.service.updateMe(userId, body);
  }

  @Delete('me')
  deleteMe(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) return { ok: false };
    return this.service.deleteSelf(userId);
  }
}
