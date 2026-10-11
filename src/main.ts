import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PROMOTION_PORT || '8084', 10);
  await app.listen(port, '0.0.0.0');
  logger.info({ port }, 'promotion-service listening');
}
bootstrap();
