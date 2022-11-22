import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, Table, QueryRunner } from 'typeorm';
import { OBJECT_DATABASE_NAME, OBJECT_TABLE_COLUMN_LIST } from './constant/object-database.constant';
import { RowDataPacket } from 'mysql2';
import { Workspace } from 'src/workspace/entity/workspace.entity';

@Injectable()
export class ObjectDatabaseService {
  constructor(private dataSource: DataSource) {}

  /**
   * Object Table을 생성합니다.
   *
   * 이미 Object Table을 갖고 있을 경우 무시됩니다.
   * @param workspaceId 생성할 Object Table와 연결될 Workspace ID
   */
  async createObjectTable(workspaceId: string, usedQueryRunner?: QueryRunner): Promise<void> {
    const queryRunner = usedQueryRunner ? usedQueryRunner : this.dataSource.createQueryRunner();
    if (!usedQueryRunner) await queryRunner.connect();

    const isWorkspaceExist = await queryRunner.manager.findOne(Workspace, { where: { workspaceId } });
    if (!isWorkspaceExist) throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');

    try {
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
      if (!usedQueryRunner) await queryRunner.release();
    }
  }

  /**
   * Object Table을 삭제합니다.
   *
   * Object Table이 존재하지 않을 경우 무시됩니다.
   * @param workspaceId Object Table과 연결된 워크스페이스의 ID
   * @param usedQueryRunner 해당 함수를 QueryRunner의 Transaction 도중에 사용하는 경우에 대응함.
   */
  async deleteObjectTable(workspaceId: string, usedQueryRunner?: QueryRunner): Promise<void> {
    const queryRunner = usedQueryRunner ? usedQueryRunner : this.dataSource.createQueryRunner();
    if (!usedQueryRunner) await queryRunner.connect();
    try {
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
      if (!usedQueryRunner) await queryRunner.release();
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

  /**
   * Object Table을 복사합니다.
   *
   * 원하는 Object 테이블을 복사하여, 동일한 값을 갖는 새로운 테이블을 생성합니다.
   * @param workspaceId 복사한 Object Table과 연결할 워크스페이스의 ID
   * @param targetObjectTableName 원본 Object Table의 이름
   */
  async copyObjectTable(workspaceId: string, targetObjectTableName: string): Promise<boolean> {
    if (!workspaceId || !targetObjectTableName) return false;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // 복사 대상 테이블이 존재하는지 확인하고, 없으면 실패를 반환한다.
    const isTableExist = await queryRunner.hasTable(
      new Table({
        database: OBJECT_DATABASE_NAME,
        name: targetObjectTableName,
      }),
    );
    console.log(isTableExist);
    if (!isTableExist) {
      await queryRunner.release();
      return false;
    }

    // 복사 결과 테이블 객체를 생성한다.
    const newTable = new Table({
      database: OBJECT_DATABASE_NAME,
      name: workspaceId,
      columns: OBJECT_TABLE_COLUMN_LIST,
    });

    try {
      await queryRunner.startTransaction();

      const rows: RowDataPacket[] = await queryRunner.query(
        `SELECT * FROM \`${OBJECT_DATABASE_NAME}\`.\`${targetObjectTableName}\``,
      );

      // 테이블 생성
      await queryRunner.createTable(newTable);
      // 쿼리 스트링 생성
      const queryTexts: string[] = this.buildInsertQueryStringArrayFromRowDataPacket(rows, workspaceId);
      // 쿼리 처리
      for (const queryText of queryTexts) {
        await queryRunner.query(queryText);
      }
      // 완료 시 commit 수행
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      if (error.sqlState !== '42S01') await queryRunner.dropTable(newTable); // queryRunner가 담당하던 DataSource 외부의 것은 Transaction이 반영이 안되는 듯?
      await queryRunner.rollbackTransaction();
      console.error(error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  private buildInsertQueryStringArrayFromRowDataPacket(
    rowDataPacketArray: RowDataPacket[],
    targetTable: string,
  ): string[] {
    // RowDataPacket을 column 이름과 value로 분할
    const queryTexts: string[] = rowDataPacketArray.map((row) => {
      const parsedRow = Object.entries(row).reduce(
        (pre, val) => {
          if (val[1] === null) return pre;

          pre.columns.push(`${val[0]}`);
          pre.value.push(`'${val[1]}'`);
          return pre;
        },
        { columns: [], value: [] },
      );

      // 분할한 값을 바탕으로 Insert 쿼리문 작성.
      const queryText = `
        INSERT INTO \`${OBJECT_DATABASE_NAME}\`.\`${targetTable}\`
        (${parsedRow.columns.join(', ')})
        VALUES (${parsedRow.value.join(', ')});
      `;
      return queryText;
    });
    return queryTexts;
  }
}
