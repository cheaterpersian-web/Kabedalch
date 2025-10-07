import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { PackagesModule } from './packages/packages.module';
import { TestsModule } from './tests/tests.module';
import { OrdersModule } from './orders/orders.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { PostsModule } from './posts/posts.module';
import { SettingsModule } from './settings/settings.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { CmsController } from './cms/cms.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { HealthController } from './health.controller';
import { SecurityController } from './common/security.controller';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      },
    }),
    AuthModule,
    PackagesModule,
    TestsModule,
    OrdersModule,
    TestimonialsModule,
    PostsModule,
    SettingsModule,
    WebhooksModule,
    ConsultationsModule,
    AdminModule,
    UploadsModule,
    UsersModule,
  ],
  controllers: [HealthController, SecurityController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [HealthController],
})
export class AppModule {}
