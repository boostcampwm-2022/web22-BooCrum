import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { createSessionMiddleware } from './middlewares/session.middleware';
import { RedisIoAdapter } from './socket/adapter/custom-socket.adapter';

async function bootstrap() {
  const apiPort = parseInt(process.env.API_PORT);
  const wsPort = parseInt(process.env.WS_PORT);
  // 서버 초기화
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app, wsPort);

  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // 세션 초기화
  app.use(createSessionMiddleware());

  app.setGlobalPrefix('api');
  await app.listen(apiPort);
  console.log(`API Server Listen: ${apiPort}\nWs Server Listen: ${wsPort}`);
}
bootstrap();
