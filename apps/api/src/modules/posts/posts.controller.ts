import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private service: PostsService) {}

  @Get()
  list() {
    return this.service.listPublished();
  }
}
