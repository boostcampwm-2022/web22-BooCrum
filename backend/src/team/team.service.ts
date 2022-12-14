import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Team } from './entity/team.entity';
import { TeamMember } from './entity/team-member.entity';
import { IsTeam } from './enum/is-team.enum';
import { TeamDTO } from './dto/team.dto';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { TEAM_ROLE } from '../util/constant/role.constant';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
    private dataSource: DataSource,
    private userService: UserService,
  ) {}

  // 회원가입 시 팀 생성
  async createUser({ userId }: User): Promise<any> {
    const team = await this.teamRepository.save(new Team(`${userId}`, IsTeam.USER));
    const user = await this.userService.findUser(userId);
    const teamMember = new TeamMember(user, team, TEAM_ROLE.ADMIN);
    this.insertTeamMember(team.teamId, teamMember);
    return team;
  }

  // 사용자 생성 팀 생성
  async createTeam(teamDTO: TeamDTO): Promise<any> {
    const team = await this.teamRepository.save(new Team(teamDTO.name, IsTeam.TEAM, teamDTO.description));
    const user = await this.userService.findUser(teamDTO.userId);
    const teamMember = new TeamMember(user, team, TEAM_ROLE.ADMIN);
    this.insertTeamMember(team.teamId, teamMember);
    return team;
  }

  // 팀 멤버 추가
  async insertTeamMember(team: number, teamMember: TeamMember): Promise<boolean> {
    if (await this.findTeamMember(team, teamMember.user)) throw new BadRequestException('이미 존재하는 회원입니다.');

    const result: InsertResult = await this.teamMemberRepository
      .createQueryBuilder()
      .insert()
      .into('team_member')
      .values({ user: teamMember.user, team, role: teamMember.role })
      .execute();

    return Boolean(result.raw.affectedRows);
  }

  // 팀 멤버 찾기
  async findTeamMember(team: number, user: string | User): Promise<TeamMember | undefined> {
    return await this.teamMemberRepository
      .createQueryBuilder('teamMember')
      .where('teamMember.team_id = :team', { team })
      .andWhere('teamMember.user_id = :user', { user })
      .getOne();
  }

  // 팀 & 팀 멤버 조회 (팀ID, 팀명, 팀 설명, 팀 생성일, 회원ID, 닉네임, 역할)
  async selectTeamMember(teamId: number): Promise<Team[] | undefined> {
    return await this.teamRepository
      .createQueryBuilder('team')
      .where('team.team_id = :teamId', { teamId })
      // .andWhere('team.isTeam = :isTeam', { isTeam: 1 })
      .innerJoin('team.teamMember', 'teamMember')
      .innerJoin('teamMember.user', 'user')
      .select([
        'team.teamId',
        'team.name',
        'team.description',
        'team.registerDate',
        'user.userId',
        'user.nickname',
        'teamMember.role',
      ])
      .getMany();
  }

  // 팀 & 워크스페이스 조회
  async selectTeamWorkspace(teamId: number): Promise<Team[] | undefined> {
    return await this.teamRepository
      .createQueryBuilder('team')
      .where('team.team_id = :teamId', { teamId })
      .innerJoin('team.workspace', 'workspace')
      .select([
        'team.teamId',
        'team.name',
        'team.description',
        'team.registerDate',
        'workspace.workspaceId',
        'workspace.name',
        'workspace.description',
        'workspace.registerDate',
        'workspace.updateDate',
      ])
      .getMany();
  }

  // 팀 수정 : 팀명, 팀 설명 변경
  async updateTeam({ teamId, name, description }: Team): Promise<boolean> {
    const result: UpdateResult = await this.teamRepository
      .createQueryBuilder()
      .update('team')
      .set({ name, description })
      .where('team.team_id = :teamId', { teamId })
      .execute();
    return Boolean(result.raw.affectedRows);
  }

  // 팀 멤버 수정 : 권한 수정
  async updateTeamMember(teamId: number, teamMember: TeamMember): Promise<boolean> {
    const result = await this.teamMemberRepository
      .createQueryBuilder()
      .update('team_member')
      .where('team_member.team_id = :teamId', { teamId })
      .andWhere('team_member.user_id = :user', { user: teamMember.user })
      .set({ role: teamMember.role })
      .execute();

    return Boolean(result.raw.affectedRows);
  }

  // 팀 삭제 : 팀 멤버 전체 삭제 > 팀 삭제
  async deleteTeam(teamId: number): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(TeamMember, { team: teamId });
      await queryRunner.manager.delete(Team, { teamId });

      await queryRunner.commitTransaction();
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 팀 멤버 일부 삭제
  async deleteTeamMember(teamId: number, userId: string): Promise<boolean> {
    const result: DeleteResult = await this.teamMemberRepository
      .createQueryBuilder()
      .delete()
      .from('team_member')
      .where('team_member.team_id = :teamId', { teamId })
      .andWhere('team_member.user_id = :userId', { userId })
      .execute();

    return Boolean(result.raw.affectedRows);
  }

  // 팀 멤버 전체 삭제
  async deleteEveryTeamMember({ team }: TeamMember): Promise<boolean> {
    const result: DeleteResult = await this.teamMemberRepository
      .createQueryBuilder()
      .delete()
      .from('team_member')
      .where('team_member.team_id = :team', { team })
      .execute();
    return Boolean(result.raw.affectedRows);
  }

  // 팀 ID를 통한 팀 찾기
  async findTeam(teamId: number): Promise<Team> {
    return await this.teamRepository.createQueryBuilder('team').where('team.team_id = :teamId', { teamId }).getOne();
  }

  // user 개인 팀을 userId로 찾기
  async findUserTeam(userId: string): Promise<Team> {
    const ret = await this.teamMemberRepository
      .createQueryBuilder('team_member')
      .innerJoinAndSelect('team_member.team', 'team')
      .where('team_member.user_id = :userId', { userId })
      .andWhere('team.is_team = :isTeam', { isTeam: 0 })
      .getOne();
    return ret.team;
  }
}
