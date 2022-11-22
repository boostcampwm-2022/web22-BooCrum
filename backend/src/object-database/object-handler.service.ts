import { BadRequestException, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { DataSource } from 'typeorm';
import { OBJECT_DATABASE_NAME, OBJECT_TABLE_COLUMN_LIST } from './constant/object-database.constant';
import { CreateObjectDTO } from './dto/create-object.dto';
import { ObjectDatabaseService } from './object-database.service';

@Injectable()
export class ObjectHandlerService {
  constructor(private dataSource: DataSource, private objectDatabaseService: ObjectDatabaseService) {}

  async selectAllObjects(workspaceId: string): Promise<RowDataPacket[] | undefined> {
    const objectTable = this.objectDatabaseService.isObjectTableExist(workspaceId);
    if (!objectTable) throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      return await queryRunner.query(`SELECT * FROM \`${OBJECT_DATABASE_NAME}\`.\`${workspaceId}\``);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async selectObjectById(workspaceId: string, objectId: number): Promise<RowDataPacket[] | undefined> {
    const objectTable = this.objectDatabaseService.isObjectTableExist(workspaceId);
    if (!objectTable) throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      return (
        await queryRunner.query(
          `SELECT * FROM \`${OBJECT_DATABASE_NAME}\`.\`${workspaceId}\` WHERE object_id = ${objectId}`,
        )
      )[0];
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createObject(workspaceId: string, createObjectDTO: CreateObjectDTO) {
    const objectTable = this.objectDatabaseService.isObjectTableExist(workspaceId);
    if (!objectTable) throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    let ret;

    try {
      await queryRunner.connect();
      const { type, xPos, yPos, width, height, color, text } = createObjectDTO;
      await queryRunner.query(
        `INSERT INTO \`${OBJECT_DATABASE_NAME}\`.\`${workspaceId}\` (type, x_pos, y_pos, width, height, color, text) 
         VALUES ('${type}', '${xPos}', '${yPos}', '${width}', '${height}', '${color}', '${text}')`,
      );
      ret = true;
    } catch (error) {
      ret = false;
    } finally {
      await queryRunner.release();
      return ret;
    }
  }

  async updateObject(workspaceId: string, objectId: number, createObjectDTO: CreateObjectDTO) {
    const objectTable = this.objectDatabaseService.isObjectTableExist(workspaceId);
    if (!objectTable) throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');

    const object = await this.selectObjectById(workspaceId, objectId);
    if (!object) throw new BadRequestException('존재하지 않는 객체입니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    let ret;

    try {
      await queryRunner.connect();
      const { xPos, yPos, width, height, color, text } = createObjectDTO;
      await queryRunner.query(
        `UPDATE \`${OBJECT_DATABASE_NAME}\`.\`${workspaceId}\` 
         SET x_pos = '${xPos}',
         y_pos = '${yPos}',
         width = '${width}',
         height = '${height}',
         color = '${color}',
         text = '${text}'
         WHERE object_id = '${objectId}'`,
      );
      ret = true;
    } catch (error) {
      ret = false;
    } finally {
      await queryRunner.release();
      return ret;
    }
  }
}
