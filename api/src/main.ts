import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // CORS configuration from environment variables
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://public-website',
        'http://admin-backoffice',
      ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = parseInt(process.env.PORT || '4000');
  await app.listen(port);
  console.log(`🚀 ASSBEP API running on http://localhost:${port}`);
  console.log(`✅ CORS enabled for: ${corsOrigins.join(', ')}`);
}
bootstrap();
