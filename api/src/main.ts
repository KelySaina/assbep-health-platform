import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildOriginMatcher(patterns: string[]) {
  const regexes = patterns.map((pattern) => {
    const normalizedPattern = pattern.trim();
    const regexPattern = `^${escapeRegex(normalizedPattern).replace(/\\\*/g, '.*')}$`;
    return new RegExp(regexPattern);
  });

  return (origin: string) => regexes.some((regex) => regex.test(origin));
}

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
  const corsOriginPatterns = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://public-website',
        'http://admin-backoffice',
      ];

  const isAllowedOrigin = buildOriginMatcher(corsOriginPatterns);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
  });

  const port = parseInt(process.env.PORT || '4000');
  await app.listen(port);
  console.log(`🚀 ASSBEP API running on http://localhost:${port}`);
  console.log(`✅ CORS enabled for: ${corsOriginPatterns.join(', ')}`);
}
bootstrap();
