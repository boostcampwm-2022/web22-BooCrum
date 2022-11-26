import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ValidationPipe,
  Body,
  Patch,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTableRequestDto } from './dto/create-table-request.dto';
import { ObjectHandlerService } from './object-handler.service';
import { SelectObjectDTO } from './dto/select-object.dto';
import { CreateObjectDTO } from './dto/create-object.dto';

@Controller('object-database')
export class ObjectDatabaseController {
  constructor(private objectHandlerService: ObjectHandlerService) {}

  @Get('/:workspaceId/object')
  async selectAllObjects(@Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto) {
    return await this.objectHandlerService.selectAllObjects(workspaceId);
  }

  @Get('/:workspaceId/object/:objectId')
  async selectOneObject(@Param(new ValidationPipe()) { workspaceId, objectId }: SelectObjectDTO) {
    return await this.objectHandlerService.selectObjectById(workspaceId, objectId);
  }

  @Post('/:workspaceId/object')
  async createObject(
    @Param(new ValidationPipe()) { workspaceId }: CreateTableRequestDto,
    @Body(new ValidationPipe()) createObjectDTO: CreateObjectDTO,
  ) {
    const result = await this.objectHandlerService.createObject(workspaceId, createObjectDTO);
    if (!result) throw new InternalServerErrorException('알 수 없는 이유로 데이터 추가에 실패하였습니다.');
  }

  @Patch('/:workspaceId/object/:objectId')
  async updateObject(
    @Param(new ValidationPipe()) { workspaceId, objectId }: SelectObjectDTO,
    @Body() createObjectDTO: CreateObjectDTO,
  ) {
    const result = await this.objectHandlerService.updateObject(workspaceId, createObjectDTO);
    if (!result) throw new InternalServerErrorException('알 수 없는 이유로 데이터 갱신에 실패하였습니다.');
  }

  @Delete('/:workspaceId/object/:objectId')
  async deleteObject(@Param(new ValidationPipe()) { workspaceId, objectId }: SelectObjectDTO) {
    const result = await this.objectHandlerService.deleteObject(workspaceId, objectId);
    if (!result) throw new InternalServerErrorException('알 수 없는 이유로 데이터 삭제에 실패하였습니다.');
  }
}
