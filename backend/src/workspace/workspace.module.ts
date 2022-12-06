import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entity/workspace.entity';
import { WorkspaceMember } from './entity/workspace-member.entity';
import { ObjectDatabaseModule } from '../object-database/object-database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectBucket, ObjectBucketSchema } from 'src/object-database/schema/object-bucket.schema';
import { TemplateBucket, TemplateBucketSchema } from 'src/object-database/schema/template-bucket.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, WorkspaceMember]),
    MongooseModule.forFeature([
      { name: ObjectBucket.name, schema: ObjectBucketSchema },
      { name: TemplateBucket.name, schema: TemplateBucketSchema },
    ]),
    ObjectDatabaseModule,
  ],
  providers: [WorkspaceService],
  controllers: [WorkspaceController],
})
export class WorkspaceModule {}
