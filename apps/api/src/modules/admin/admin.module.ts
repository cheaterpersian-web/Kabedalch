import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../common/prisma.service';
import { ExportsController } from './exports.controller';
import { AdminPostsController } from './admin.posts.controller';
import { AdminTestsController } from './admin.tests.controller';
import { AdminSettingsController } from './admin.settings.controller';
import { CmsController } from '../cms/cms.controller';
import { AuditService } from '../common/audit.service';

@Module({ controllers: [AdminController, ExportsController, AdminPostsController, AdminTestsController, AdminSettingsController, CmsController], providers: [PrismaService, AuditService] })
export class AdminModule {}
