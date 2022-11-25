import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { isUUID } from 'class-validator';
import { Workspace } from '../workspace/entity/workspace.entity';
import { WorkspaceMember } from '../workspace/entity/workspace-member.entity';

@Injectable()
export class DbAccessService {
  constructor(private dataSoruce: DataSource) {}

  async isWorkspaceExist(workspaceId: string, usedQueryRunner?: QueryRunner): Promise<boolean> {
    if (!isUUID(workspaceId)) return false;

    // QueryRunner 재활용 여부 판단
    const queryRunner = usedQueryRunner ? usedQueryRunner : this.dataSoruce.createQueryRunner();
    if (queryRunner !== usedQueryRunner) await queryRunner.connect();
    const ret = await queryRunner.manager.findOne(Workspace, { where: { workspaceId } });
    if (queryRunner !== usedQueryRunner) await queryRunner.release();
    return ret !== null;
  }

  async getUserRoleAt(userId: string, workspaceId: string, usedQueryRunner?: QueryRunner): Promise<number> {
    if (!isUUID(workspaceId)) return -1;

    const queryRunner = usedQueryRunner ? usedQueryRunner : this.dataSoruce.createQueryRunner();
    if (queryRunner !== usedQueryRunner) await queryRunner.connect();
    const ret = await queryRunner.manager
      .createQueryBuilder(WorkspaceMember, 'ws')
      .select()
      .where('ws.user_id = :uid', { uid: userId })
      .andWhere('ws.workspace_id = :wid', { wid: workspaceId })
      .getOne();
    if (queryRunner !== usedQueryRunner) await queryRunner.release();
    return ret?.role ?? -1;
  }
}
