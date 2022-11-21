import { Injectable, BadRequestException } from '@nestjs/common';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { DataSource, Table } from 'typeorm';
import { OBJECT_DATABASE_NAME, OBJECT_TABLE_COLUMN_LIST } from './constant/object-database.constant';

@Injectable()
export class ObjectDatabaseService {
  constructor(private dataSource: DataSource, private workspaceService: WorkspaceService) {}

  async createObjectTable(workspaceId: string) {
    const workspace = this.workspaceService.getWorkspaceMetadata(workspaceId);
    if (!workspace) throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.createDatabase(OBJECT_DATABASE_NAME, true);
      await queryRunner.createTable(
        new Table({
          database: OBJECT_DATABASE_NAME,
          name: workspaceId,
          columns: OBJECT_TABLE_COLUMN_LIST,
        }),
        true,
      );
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
