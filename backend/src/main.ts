import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSessionMiddleware } from './middlewares/session.middleware';
import { RedisIoAdapter } from './socket/adapter/custom-socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);

  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // 세션 초기화
  app.use(createSessionMiddleware());

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
