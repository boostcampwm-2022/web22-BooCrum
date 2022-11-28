import { Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { isUUID } from 'class-validator';
import { Workspace } from '../workspace/entity/workspace.entity';
import { WorkspaceMember } from '../workspace/entity/workspace-member.entity';
import { WsException } from '@nestjs/websockets';
import { User } from 'src/user/entity/user.entity';
import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';

@Injectable()
export class DbAccessService {
  private logger: Logger = new Logger('DbAccessService');

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

  /**
   * 특정 유저를 지정한 권한으로 등록합니다. 기존의 멤버일 경우, 권한을 새로 업데이트 합니다.
   * @param userId 특정 사용자의 ID
   * @param workspaceId 사용자의 권한을 추가하려는 워크스페이스 ID
   * @param grantedRole 사용자에게 부여하고자 하는 권한
   * @param usedQueryRunner (Optional) 기존에 사용하던 QueryRunner
   */
  private async addUserAsWorkspaceMember(
    userId: string,
    workspaceId: string,
    grantedRole: number,
    usedQueryRunner: QueryRunner,
  ): Promise<boolean> {
    if (grantedRole < 0) return false;

    const queryRunner = usedQueryRunner ? usedQueryRunner : this.dataSoruce.createQueryRunner();
    if (!usedQueryRunner) await queryRunner.connect();
    try {
      const [userFind, workspaceFind] = await Promise.all([
        queryRunner.manager.findOne(User, { where: { userId } }),
        queryRunner.manager.findOne(Workspace, { where: { workspaceId } }),
      ]);
      if (userFind === null || workspaceFind === null) return false;

      let newMember = new WorkspaceMember();
      newMember.user = userFind;
      newMember.workspace = workspaceFind;
      newMember.role = grantedRole;
      newMember = await queryRunner.manager.save(newMember);

      return true;
    } catch (e) {
      this.logger.error(e);
      return false;
    } finally {
      if (!usedQueryRunner) await queryRunner.release();
    }
  }

  /**
   * 특정 사용자의 Role을 탐색합니다.
   * @param userId 특정 사용자의 ID
   * @param workspaceId 사용자의 권한을 확인하려는 워크스페이스 ID
   * @param usedQueryRunner (Optional) 기존에 사용하던 QueryRunner
   * @returns 탐색 실패 시 -1, 탐색 성공 시 0 이상의 정수
   */
  private async getUserRoleAt(
    userId: string,
    workspaceId: string,
    usedQueryRunner?: QueryRunner,
  ): Promise<WORKSPACE_ROLE | number> {
    if (!(await this.isWorkspaceExist(workspaceId))) throw new Error('존재하지 않는 Workspace에 접근하였습니다.');

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

  async getOrCreateUserRoleAt(
    userId: string,
    workspaceId: string,
    defaultRole: number,
  ): Promise<WORKSPACE_ROLE | number> {
    if (defaultRole < 0) throw new Error('부적절한 기본 부여 권한');

    const queryRunner = this.dataSoruce.createQueryRunner();
    queryRunner.connect();
    try {
      const userRole = await this.getUserRoleAt(userId, workspaceId, queryRunner);
      if (userRole >= 0) return userRole;

      const result = await this.addUserAsWorkspaceMember(userId, workspaceId, defaultRole, queryRunner);
      if (!result) throw new Error('유저 권한 부여 실패');
      return defaultRole;
    } catch (e) {
      this.logger.error(e);
      return -1;
    } finally {
      queryRunner.release();
    }
  }
}
