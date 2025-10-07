import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.use(helmet());
  if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
  }
  app.use(cookieParser());
  if (process.env.CSRF_ENABLE === 'true') {
    app.use(
      csurf({ cookie: { httpOnly: true, sameSite: 'lax', secure: false } })
    );
  }
  app.enableCors({ origin: /localhost|127\.0\.0\.1/, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Liver & Alcohol API')
    .setDescription('API برای وب‌سایت کبد چرب و ترک الکل')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
