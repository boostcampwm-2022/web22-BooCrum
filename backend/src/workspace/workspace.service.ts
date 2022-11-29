/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../team/entity/team.entity';
import { User } from '../user/entity/user.entity';
import { Repository, DataSource } from 'typeorm';
import { WorkspaceCreateRequestDto } from './dto/workspaceCreateRequest.dto';
import { WorkspaceMetadataDto } from './dto/workspaceMetadata.dto';
import { WorkspaceMember } from './entity/workspace-member.entity';
import { Workspace } from './entity/workspace.entity';
import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    private dataSource: DataSource,
  ) {}

  async getAuthorityOfUser(workspaceId: string, userId: string): Promise<number> {
    return (
      (
        await this.workspaceMemberRepository
          .createQueryBuilder()
          .where('user_id = :uid', { uid: userId })
          .andWhere('workspace_id = :wid', { wid: workspaceId })
          .getOne()
      )?.role ?? WORKSPACE_ROLE.VIEWER
    );
  }

  /**
   * 워크스페이스를 생성합니다.
   * @param param0 워크스페이스를 생성하는데 필요한 정보들입니다. (신규 워크스페이스를 소유할 팀/유저 ID와 워크스페이스 이름, 설명)
   * @returns 생성한 워크스페이스의 정보를 반환합니다.
   */
  async createWorkspace({ teamId, ownerId: userId, name, description }: WorkspaceCreateRequestDto): Promise<Workspace> {
    const newWorkspace = new Workspace();
    const workspaceMember = new WorkspaceMember();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const teamFind = await queryRunner.manager.findOne(Team, {
        where: { teamId },
      });
      const userFind = await queryRunner.manager.findOne(User, {
        where: { userId },
      });
      if (!teamFind || !userFind) {
        throw new BadRequestException('잘못된 사용자 ID 혹은 팀 ID 입니다.');
      }

      workspaceMember.role = WORKSPACE_ROLE.OWNER;
      workspaceMember.user = userFind;
      workspaceMember.workspace = newWorkspace;

      newWorkspace.team = teamFind;
      newWorkspace.name = name ?? 'untitled';
      newWorkspace.description = description ?? null;
      newWorkspace.team = teamFind;

      const ret = await queryRunner.manager.save(newWorkspace);
      await queryRunner.manager.save(workspaceMember);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return ret;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e; // 서버 오류니까 되던지기 한다.
    }
  }

  /**
   * 특정 워크스페이스에 대한 모든 정보를 가져옵니다. (소유 팀 + 워크스페이즈 참여자들 + 메타데이터)
   * @param workspaceId 특정 워크스페이스에 대한 ID 값입니다.
   * @return 특정 워크스페이스에 대한 모든 정보를 반환합니다.
   */
  async getWorkspaceData(workspaceId: string): Promise<Workspace> {
    return await this.workspaceRepository
      .createQueryBuilder('ws')
      .where('ws.workspace_id = :id', { id: workspaceId })
      .leftJoinAndSelect('ws.workspaceMember', 'wm')
      .leftJoinAndSelect('ws.team', 'team')
      .leftJoinAndSelect('wm.user', 'user')
      .select()
      .getOne();
  }

  /**
   * 특정 워크스페이스에 한번이라도 참여한 사람들의 명단을 불러옵니다.
   * @param workspaceId 특정 워크스페이스에 대한 ID 값입니다.
   * @returns 특정 워크스페이스에 참여한 유저들의 명단입니다.
   */
  async getWorkspaceParticipantList(workspaceId: string): Promise<WorkspaceMember[]> {
    return await this.workspaceMemberRepository
      .createQueryBuilder('wm')
      .where('wm.workspace_id = :id', { id: workspaceId })
      .leftJoinAndSelect('wm.user', 'user')
      .getMany();
  }

  /**
   * 특정 워크스페이스의 메타데이터를 불러옵니다.
   * @param workspaceId 특정 워크스페이스에 대한 ID 값입니다.
   * @returns 특정 워크스페이스의 메타데이터를 전달합니다.
   */
  async getWorkspaceMetadata(workspaceId: string): Promise<Workspace> {
    return await this.workspaceRepository.findOne({
      where: { workspaceId },
    });
  }

  async getWorkspaceOwnerTeam(workspaceId: string): Promise<Team | null> {
    return (
      await this.workspaceRepository
        .createQueryBuilder('w')
        .where({ workspaceId })
        .leftJoinAndSelect('w.team', 'team')
        .getOne()
    ).team;
  }

  /**
   * 특정 유저가 참여한 Workspace 목록을 가져옵니다.
   * @param userId 유저 ID 입니다.
   * @returns Workspace 목록을 가져옵니다.
   */
  async getUserOwnWorkspaceList(userId: string): Promise<WorkspaceMember[]> {
    return await this.workspaceMemberRepository
      .createQueryBuilder('wm')
      .where('wm.user_id = :id', { id: userId })
      .leftJoinAndSelect('wm.workspace', 'ws')
      .select(['wm.role', 'ws'])
      .getMany();
  }

  /**
   * 특정 팀이 소유한 Workspace 목록을 가져옵니다.
   * @param teamId 팀 ID 입니다.
   * @returns Workspace 목록을 가져옵니다.
   */
  async getTeamOwnWorkspaceList(teamId: number): Promise<Workspace[]> {
    return await this.workspaceRepository
      .createQueryBuilder('ws')
      .leftJoin('ws.team', 'team')
      .where('team.team_id = :id', { id: teamId })
      .getMany();
  }

  /**
   * 사용자를 워크스페이스에 초대합니다.
   * @param userId 유저 ID 입니다.
   * @param workspaceId 워크스페이스 ID 입니다.
   * @param role 유저가 해당 워크스페이스에 갖게될 권한입니다.
   * @returns 추가 결과를 반환합니다.
   */
  async addUserIntoWorkspace(
    userId: string,
    workspaceId: string,
    role = WORKSPACE_ROLE.VIEWER,
  ): Promise<WorkspaceMember> {
    const userFind = await this.workspaceMemberRepository
      .createQueryBuilder('wm')
      .where('wm.user_id = :id', { id: userId })
      .andWhere('wm.workspace_id = :id', { id: workspaceId })
      .getOne();
    if (userFind) throw new BadRequestException('이미 존재하는 사용자입니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let newMember = new WorkspaceMember();
      newMember.role = role;
      newMember.user = await queryRunner.manager.findOne(User, {
        where: { userId },
      });
      newMember.workspace = await queryRunner.manager.findOne(Workspace, {
        where: { workspaceId },
      });
      if (!newMember.user || !newMember.workspace)
        throw new BadRequestException('잘못된 사용자 Id 혹은 워크스페이스 Id입니다.');
      newMember = await queryRunner.manager.save(newMember);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      delete newMember.id;
      return newMember;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }

  /**
   * 워크스페이스를 삭제합니다.
   *
   * ※주의※ 권한을 확인하지 않습니다. 삭제 전 권한을 확인해주시기 바랍니다.
   * @param workspaceId 삭제할 워크스페이스의 Id입니다.
   */
  async deleteWorkspace(workspaceId: string): Promise<void> {
    const workspaceFind = await this.workspaceRepository.find({
      where: { workspaceId },
    });
    if (!workspaceFind) {
      throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Team에서 Workspace 제거 (One To Many의 Many면 그냥 삭제해도 되지 않나? → 패스)
      // workspaceMember에서 모든 멤버 정보 삭제
      await this.workspaceMemberRepository
        .createQueryBuilder('wm', queryRunner)
        .delete()
        .where('workspace_id = :id', { id: workspaceId })
        .execute();
      // 워크스페이스 메타데이터 제거
      await queryRunner.manager.delete(Workspace, { workspaceId });

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }

  /**
   * 워크스페이스의 메타데이터를 변경합니다.
   *
   * ※주의※ 권한을 확인하지 않습니다. 사용 전에 권한을 확인해주시기 바랍니다.
   * @param workspaceId 메타데이터를 수정할 워크스페이스의 ID입니다.
   * @param newMetaData 변경할 메타데이터 객체입니다.
   * @returns 변경 가능한 것이 존재할 경우 true를 반환합니다.
   */
  async updateWorkspaceMetadata(workspaceId: string, newMetaData: WorkspaceMetadataDto): Promise<boolean> {
    const workspaceFind = this.workspaceRepository.findOne({
      where: { workspaceId },
    });
    if (!workspaceFind) throw new BadRequestException('잘못된 워크스페이스 ID입니다.');
    return (
      (
        await this.workspaceRepository.update(
          { workspaceId },
          { ...newMetaData, updateDate: () => 'CURRENT_TIMESTAMP' },
        )
      ).affected > 0
    );
  }

  /**
   * 사용자의 워크스페이스에 대한 권한을 조정합니다.
   *
   * ※주의※ 권한을 확인하지 않습니다. 사용 전에 권한을 확인해주시기 바랍니다.
   * @param workspaceId 권한 조정 대상인 워크스페이스 ID입니다.
   * @param userId 권한 조정 대상인 사용자 ID 입니다.
   * @param newRole 새로운 Role을 지정합니다.
   */
  async updateUesrAuthority(workspaceId: string, userId: string, newRole: number): Promise<boolean> {
    return (
      (
        await this.workspaceMemberRepository
          .createQueryBuilder()
          .update({ role: newRole })
          .where('workspace_id = :wid', { wid: workspaceId })
          .andWhere('user_id = :uid', { uid: userId })
          .execute()
      ).affected > 0
    );
  }

  /**
   * 워크스페이스에 대한 사용자의 권한을 반환합니다.
   *
   * 0: Viewer, 1: Editor, 2: Admin
   * @param workspaceId   권한을 조회할 워크스페이스 ID입니다.
   * @param userId        권한을 조회할 사용자 ID 입니다.
   */
  async getWorkspaceAuthority(workspaceId: string, userId: string) {
    const member = await this.workspaceMemberRepository
      .createQueryBuilder()
      .select()
      .where('workspace_id = :workspaceId', { workspaceId })
      .andWhere('user_id = :userId', { userId })
      .getOne();

    return !member ? WORKSPACE_ROLE.NOT_FOUND : member.role;
  }
}
