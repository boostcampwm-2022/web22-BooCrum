import { Module } from '@nestjs/common';
import { ObjectDatabaseService } from './object-database.service';
import { ObjectDatabaseController } from './object-database.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from 'src/workspace/entity/workspace.entity';
import { WorkspaceMember } from 'src/workspace/entity/workspace-member.entity';

@Module({
  imports: [WorkspaceModule, TypeOrmModule.forFeature([Workspace, WorkspaceMember])],
  controllers: [ObjectDatabaseController],
  providers: [ObjectDatabaseService, WorkspaceService],
})
export class ObjectDatabaseModule {}
