import { Module } from '@nestjs/common';
import { ObjectDatabaseController } from './object-database.controller';
import { ObjectHandlerService } from './object-handler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceObject } from './entity/workspace-object.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceObject])],
  controllers: [ObjectDatabaseController],
  providers: [ObjectHandlerService],
})
export class ObjectDatabaseModule {}
