import { Controller, Delete, Get, Req } from '@nestjs/common';
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

  @Delete('me')
  deleteMe(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) return { ok: false };
    return this.service.deleteSelf(userId);
  }
}
