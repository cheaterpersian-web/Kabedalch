import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  listPublished() {
    return this.prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  }
}
