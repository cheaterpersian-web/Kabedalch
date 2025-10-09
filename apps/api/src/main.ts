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
    // Apply CSRF generally, but bypass for public API paths (tests, auth, health)
    const csrfMw = csurf({ cookie: { httpOnly: true, sameSite: 'lax', secure: false } });
    app.use((req: any, res: any, next: any) => {
      const url: string = req.url || '';
      // Allow listed public endpoints without CSRF token
      if (
        url.startsWith('/api/tests') ||
        url.startsWith('/api/auth') ||
        url.startsWith('/api/health') ||
        url.startsWith('/api/admin') ||
        // allow docs and swagger assets
        url.startsWith('/docs')
      ) {
        return next();
      }
      return csrfMw(req, res, next);
    });
  }
  const corsOrigin = process.env.CORS_ORIGIN;
  const origin = corsOrigin
    ? corsOrigin.split(',').map((s) => s.trim()).filter(Boolean)
    : [/localhost/, /127\.0\.0\.1/];
  app.enableCors({ origin, credentials: true });
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

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
