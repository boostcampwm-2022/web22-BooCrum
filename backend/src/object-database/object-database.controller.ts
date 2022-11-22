import { Controller, Res, Get, Post, Delete, Param, ValidationPipe, Body } from '@nestjs/common';
import { CreateTableRequestDto } from './dto/create-table-request.dto';
import { ObjectDatabaseService } from './object-database.service';
import { Response } from 'express';
import { ObjectHandlerService } from './object-handler.service';
import { SelectObjectDTO } from './dto/select-object.dto';
import { CreateObjectDTO } from './dto/create-object.dto';

@Controller('object-database')
export class ObjectDatabaseController {
  constructor(
    private objectDatabaseService: ObjectDatabaseService,
    private objectHandlerService: ObjectHandlerService,
  ) {}

  @Post('/:workspaceId')
  async createObjectTable(@Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto) {
    await this.objectDatabaseService.createObjectTable(workspaceId);
  }

  @Delete('/:workspaceId')
  async deleteObjectTable(@Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto) {
    await this.objectDatabaseService.deleteObjectTable(workspaceId);
  }

  @Get('/:workspaceId')
  async workspaceExist(@Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto, @Res() res: Response) {
    return res.sendStatus((await this.objectDatabaseService.isObjectTableExist(workspaceId)) ? 200 : 404);
  }

  @Get('/:workspaceId/object')
  async selectAllObjects(@Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto) {
    return this.objectHandlerService.selectAllObjects(workspaceId);
  }

  @Get('/:workspaceId/object/:objectId')
  async selectOneObjects(@Param(new ValidationPipe()) { workspaceId, objectId }: SelectObjectDTO) {
    return this.objectHandlerService.selectObjectById(workspaceId, objectId);
  }

  @Post('/:workspaceId/object')
  async createObject(
    @Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto,
    @Body() createObjectDTO: CreateObjectDTO,
  ) {
    return this.objectHandlerService.createObject(workspaceId, createObjectDTO);
  }
}
