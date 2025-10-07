import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RtbfController } from './rtbf.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [UsersService, PrismaService],
  controllers: [UsersController, RtbfController],
  exports: [UsersService],
})
export class UsersModule {}
