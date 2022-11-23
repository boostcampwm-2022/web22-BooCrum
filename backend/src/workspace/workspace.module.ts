import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entity/workspace.entity';
import { WorkspaceMember } from './entity/workspace-member.entity';
import { ObjectDatabaseModule } from '../object-database/object-database.module';
import { ObjectDatabaseService } from '../object-database/object-database.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, WorkspaceMember]), ObjectDatabaseModule],
  providers: [WorkspaceService, ObjectDatabaseService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
