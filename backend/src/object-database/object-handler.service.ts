import { BadRequestException, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { DataSource } from 'typeorm';
import { OBJECT_DATABASE_NAME, OBJECT_TABLE_COLUMN_LIST } from './constant/object-database.constant';
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
}
