import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSessionMiddleware } from './util/session.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // 세션 초기화
  app.use(createSessionMiddleware());

  await app.listen(3000);
}
bootstrap();
