import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Logger } from '@nestjs/common';
import { Cluster } from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
  private logger = new Logger('RedisIoAdapter');

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = new Cluster([{ host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT) }], {
      dnsLookup: (address, callback) => callback(null, address),
    });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => this.logger.error(err));
    subClient.on('error', (err) => this.logger.error(err));

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
