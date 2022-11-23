import { Controller, Res, Get, Post, Delete, Param, ValidationPipe, Body, Patch } from '@nestjs/common';
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
  async createObjectTable(
    @Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto,
    @Body() { targetTable },
    @Res() res: Response,
  ) {
    if (targetTable)
      res.sendStatus((await this.objectDatabaseService.copyObjectTable(workspaceId, targetTable)) ? 201 : 400);
    else await this.objectDatabaseService.createObjectTable(workspaceId);
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
    return await this.objectHandlerService.selectAllObjects(workspaceId);
  }

  @Get('/:workspaceId/object/:objectId')
  async selectOneObjects(@Param(new ValidationPipe()) { workspaceId, objectId }: SelectObjectDTO) {
    return await this.objectHandlerService.selectObjectById(workspaceId, objectId);
  }

  @Post('/:workspaceId/object')
  async createObject(
    @Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto,
    @Body(new ValidationPipe()) createObjectDTO: CreateObjectDTO,
  ) {
    return await this.objectHandlerService.createObject(workspaceId, createObjectDTO);
  }

  @Patch('/:workspaceId/object/:objectId')
  async updateObject(
    @Param(new ValidationPipe()) { workspaceId, objectId }: SelectObjectDTO,
    @Body() createObjectDTO: CreateObjectDTO,
  ) {
    return await this.objectHandlerService.updateObject(workspaceId, objectId, createObjectDTO);
  }

  @Delete('/:workspaceId/object/:objectId')
  async deleteObject(@Param(new ValidationPipe()) { workspaceId, objectId }: SelectObjectDTO) {
    return await this.objectHandlerService.deleteObject(workspaceId, objectId);
  }
}
