import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket.gateway';
import { ObjectDatabaseModule } from 'src/object-database/object-database.module';
import { ObjectHandlerService } from 'src/object-database/object-handler.service';
import { DbAccessService } from './db-access.service';
import { UserManagementService } from './user-management.service';
import { ObjectManagementService } from './object-management.service';

@Module({
  imports: [HttpModule, ObjectDatabaseModule],
  providers: [SocketGateway, ObjectHandlerService, DbAccessService, UserManagementService, ObjectManagementService],
})
export class SocketModule {}
