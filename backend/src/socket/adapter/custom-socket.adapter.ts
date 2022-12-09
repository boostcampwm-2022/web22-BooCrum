import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Logger } from '@nestjs/common';
import * as Redis from 'ioredis';
import { createSessionMiddleware } from '../../middlewares/session.middleware';
import { Request, Response, NextFunction } from 'express';

export class RedisIoAdapter extends IoAdapter {
  private logger = new Logger('RedisIoAdapter');
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = new Redis.default(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST);
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => this.logger.error(err));
    subClient.on('error', (err) => this.logger.error(err));

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    // session 연결
    const sessionMiddleware = createSessionMiddleware();
    (server as Server).use((socket, next) =>
      sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction),
    );

    server.adapter(this.adapterConstructor);
    return server;
  }
}
