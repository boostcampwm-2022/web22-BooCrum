import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket.gateway';
import { ObjectDatabaseModule } from 'src/object-database/object-database.module';
import { ObjectHandlerService } from 'src/object-database/object-handler.service';
import { DbAccessService } from './db-access.service';
import { UserManagementService } from './user-management.service';
import { ObjectManagementService } from './object-management.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    ObjectDatabaseModule,
    RedisModule.forRoot({
      config: [
        {
          namespace: 'SocketUser',
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
          db: parseInt(process.env.REDIS_SOCKET_USER_DB),
        },
        {
          namespace: 'WorkspaceUser',
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
          db: parseInt(process.env.REDIS_WORKSPACE_USER_DB),
        },
      ],
    }),
  ],
  providers: [SocketGateway, ObjectHandlerService, DbAccessService, UserManagementService, ObjectManagementService],
})
export class SocketModule {}
