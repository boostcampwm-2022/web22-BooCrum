import { Module } from '@nestjs/common';
import { ObjectDatabaseService } from './object-database.service';
import { ObjectDatabaseController } from './object-database.controller';
import { ObjectHandlerService } from './object-handler.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [ObjectDatabaseController],
  providers: [ObjectDatabaseService, ObjectHandlerService],
  exports: [ObjectDatabaseService],
})
export class ObjectDatabaseModule {}
