import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../dist/app.module';

let cachedServer:
  | ((req: VercelRequest, res: VercelResponse) => void)
  | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (process.env.CORS_ORIGINS?.split(',') as string[]) || '*',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return (req: VercelRequest, res: VercelResponse) => expressApp(req, res);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
}


