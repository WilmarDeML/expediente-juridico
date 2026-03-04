import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Servir archivos estáticos desde /uploads
  app.useStaticAssets(join(process.cwd(), 'apps/backend/uploads'), {
    prefix: '/uploads',
  });

  // CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env['BACKEND_PORT'] || 3000;
  await app.listen(port);

  Logger.log(`🚀 Backend corriendo en http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📁 Archivos estáticos en http://localhost:${port}/uploads`);
}

bootstrap();
