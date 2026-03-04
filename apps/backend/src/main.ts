import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: ['uploads/(.*)'],
  });

  // Swagger — debe ir ANTES de los pipes y filtros globales
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Expediente Jurídico API')
    .setDescription('API para la administración de expedientes jurídicos')
    .setVersion('1.0')
    .addTag('expedientes', 'Gestión de expedientes jurídicos')
    .addTag('documentos', 'Gestión de documentos y archivos')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    useGlobalPrefix: false,
  });

  // Filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Interceptor de respuesta estándar
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Archivos estáticos
  app.useStaticAssets(join(process.cwd(), 'apps/backend/uploads'), {
    prefix: '/uploads',
  });

  // CORS
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env['BACKEND_PORT'] || 3000;
  await app.listen(port);

  Logger.log(`🚀 Backend corriendo en http://localhost:${port}/api`);
  Logger.log(`📁 Archivos estáticos en http://localhost:${port}/uploads`);
  Logger.log(`📖 Swagger docs en http://localhost:${port}/api/docs`);
}

bootstrap();
