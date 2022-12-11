import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { createSessionMiddleware } from './middlewares/session.middleware';
import { RedisIoAdapter } from './socket/adapter/custom-socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);

  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // 세션 초기화
  app.use(createSessionMiddleware());

  app.setGlobalPrefix('api');
  await app.listen(process.env.API_PORT);
}
bootstrap();
