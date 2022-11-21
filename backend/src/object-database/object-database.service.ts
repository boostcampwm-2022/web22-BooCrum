import { Injectable, BadRequestException } from '@nestjs/common';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { DataSource, Table } from 'typeorm';
import { OBJECT_DATABASE_NAME, OBJECT_TABLE_COLUMN_LIST } from './constant/object-database.constant';

@Injectable()
export class ObjectDatabaseService {
  constructor(private dataSource: DataSource, private workspaceService: WorkspaceService) {}

  /**
   * Object Table을 생성합니다.
   *
   * 이미 Object Table을 갖고 있을 경우 무시됩니다.
   * @param workspaceId 생성할 Object Table와 연결될 Workspace ID
   */
  async createObjectTable(workspaceId: string): Promise<void> {
    const workspace = this.workspaceService.getWorkspaceMetadata(workspaceId);
    if (!workspace) throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
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

  /**
   * Object Table을 삭제합니다.
   *
   * Object Table이 존재하지 않을 경우 무시됩니다.
   * @param workspaceId Object Table과 연결된 워크스페이스의 ID
   */
  async deleteObjectTable(workspaceId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.dropTable(
        new Table({
          database: OBJECT_DATABASE_NAME,
          name: workspaceId,
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

  /**
   * Object Table 소유 여부를 확인합니다.
   *
   * ※주의※ 실제로 해당 Workspace가 존재하는지 확인하지 않습니다.
   * @param workspaceId 확인할 Workspace의 ID
   * @returns 존재할 경우 true, 그렇지 아니할 경우 false를 반환합니다.
   */
  async isObjectTableExist(workspaceId: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const ret = await queryRunner.hasTable(
      new Table({
        database: OBJECT_DATABASE_NAME,
        name: workspaceId,
      }),
    );
    await queryRunner.release();
    return ret;
  }
}
