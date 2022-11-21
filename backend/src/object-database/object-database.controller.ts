import { Controller, Post, Delete, Param, ValidationPipe } from '@nestjs/common';
import { CreateTableRequestDto } from './dto/create-table-request.dto';
import { ObjectDatabaseService } from './object-database.service';

@Controller('object-database')
export class ObjectDatabaseController {
  constructor(private objectDatabaseService: ObjectDatabaseService) {}

  @Post('/:workspaceId')
  async createObjectTable(@Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto) {
    await this.objectDatabaseService.createObjectTable(workspaceId);
  }

  @Delete('/:workspaceId')
  async deleteObjectTable(@Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto) {
    await this.objectDatabaseService.deleteObjectTable(workspaceId);
  }
}
