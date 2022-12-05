import { Module } from '@nestjs/common';
import { ObjectDatabaseController } from './object-database.controller';
import { ObjectHandlerService } from './object-handler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectBucket, ObjectBucketSchema } from './schema/object-bucket.schema';
import { WorkspaceObject } from './entity/workspace-object.entity';
import { MongooseObjectHandlerService } from './mongoose-object-handler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceObject]),
    MongooseModule.forFeature([{ name: ObjectBucket.name, schema: ObjectBucketSchema }]),
  ],
  controllers: [ObjectDatabaseController],
  providers: [ObjectHandlerService, MongooseObjectHandlerService],
  exports: [ObjectHandlerService, MongooseObjectHandlerService, TypeOrmModule, MongooseModule],
})
export class ObjectDatabaseModule {}
