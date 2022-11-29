/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from '../team/entity/team-member.entity';
import { Team } from '../team/entity/team.entity';
import { IsTeam } from 'src/team/enum/is-team.enum';
import { WorkspaceMember } from '../workspace/entity/workspace-member.entity';
import { Repository, DataSource } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { TEAM_ROLE } from 'src/util/constant/role.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  // 단순히 사용자 정보를 탐색합니다. 없을 경우 null을 반환합니다.
  async findUser(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { userId },
    });
  }

  // 사용자를 생성하거나 사용자 정보를 탐색합니다.
  async createOrFindUser(newUserDto: UserDto): Promise<User> {
    const userFind = await this.findUser(newUserDto.userId);
    let ret: User;
    // 이미 존재하는 사용자이면 해당 사용자 계정 정보를 전달한다.
    if (userFind) {
      return userFind;
    }

    // 없는 사용자이면 사용자를 생성하여 전달한다.
    const newUser = new User();
    newUser.userId = newUserDto.userId;
    newUser.nickname = newUserDto.nickname;

    const userTeam = new Team(newUserDto.userId, IsTeam.USER);
    const userTeamMember = new TeamMember(newUser, userTeam, TEAM_ROLE.ADMIN);

    // 오류 상황으로 일부만 완료되는 상황이 생길 경우를 고려하여, Transaction으로 처리한다.
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      ret = await queryRunner.manager.save(newUser);
      await queryRunner.manager.save(userTeam);
      await queryRunner.manager.save(userTeamMember);

      await queryRunner.commitTransaction();
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return ret;
  }

  // 사용자 정보를 변경합니다. 단, UserID와 RegisterDate는 변경할 수 없습니다.
  async changeUserData(userId: string, newData: UserDto): Promise<UserDto | null> {
    // 지정된 ID의 사용자가 존재하는지 확인한다. 없으면 그대로 return 한다.
    const userFind = await this.userRepository.findOne({
      where: { userId },
    });
    if (!userFind) {
      return null;
    }

    // 존재하면 Update를 진행한다.
    delete newData.userId, delete newData.registerDate;
    const res = await this.userRepository.update({ userId }, newData);

    if (res.affected !== 0)
      return this.userRepository.findOne({
        where: { userId },
      });
    return null;
  }

  // 사용자 정보를 삭제합니다.
  async deleteUserData(userId: string): Promise<boolean> {
    let result = false;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userFind = await queryRunner.manager.findOne(User, {
        where: { userId },
      });
      if (userFind) {
        await queryRunner.manager.delete(TeamMember, { user: userFind });
        await queryRunner.manager.delete(WorkspaceMember, { user: userFind });
        await queryRunner.manager.delete(Team, {
          name: userFind.userId,
          isTeam: false,
        });
        await queryRunner.manager.delete(User, userFind);
        // TODO: 소유한 워크스페이스 삭제 API 추가 (혹은 구현 안하고 주기적으로 날리는 방법도 있음.) (role 관련해서 시도할 것이 있다고 하여 보류함.)
      }
      result = true;
      await queryRunner.commitTransaction();
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (!result) throw new BadRequestException();
    return true;
  }

  // 사용자 정보 조회 ============================================================================

  // 사용자 정보를 가져옵니다.
  // 가져오는 정보는 "사용자 정보 + 소속 팀 및 권한 + 워크스페이스 및 권한" 입니다.
  async getUserData(userId: string): Promise<User> {
    // Join이 Row마다 이루어지는 것이 아니라, 그냥 배열에 Raw Object가 중첩되어 제공된다.
    const userData = await this.userRepository
      .createQueryBuilder('user')
      .where({ userId: userId })
      .leftJoinAndSelect('user.teamMember', 'teamMember')
      .leftJoinAndSelect('user.workspaceMember', 'workspaceMember')
      .leftJoinAndSelect('teamMember.team', 'team')
      .leftJoinAndSelect('workspaceMember.workspace', 'workspace')
      .select([
        'user.userId',
        'user.nickname',
        'user.registerDate',
        'teamMember.role',
        'team',
        'workspaceMember.role',
        'workspace',
      ])
      .getOne();
    if (!userData) throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
    return userData;
  }

  async getUserProfileData(userId: string): Promise<User> {
    const userData = await this.userRepository.findOne({ where: { userId } });
    if (!userData) throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
    return userData;
  }

  async getUserTeamData(userId: string): Promise<TeamMember[]> {
    const userData = await this.userRepository
      .createQueryBuilder('user')
      .where({ userId: userId })
      .leftJoinAndSelect('user.teamMember', 'teamMember')
      .leftJoinAndSelect('teamMember.team', 'team')
      .select(['user.userId', 'user.nickname', 'user.registerDate', 'teamMember.role', 'team'])
      .getOne();
    if (!userData) throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
    return userData.teamMember;
  }

  async getUserWorkspaceData(userId: string): Promise<WorkspaceMember[]> {
    const userData = await this.userRepository
      .createQueryBuilder('user')
      .where({ userId: userId })
      .leftJoinAndSelect('user.workspaceMember', 'workspaceMember')
      .leftJoinAndSelect('workspaceMember.workspace', 'workspace')
      .select(['user', 'workspaceMember.role', 'workspace'])
      .getOne();
    if (!userData) throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
    return userData.workspaceMember;
  }
}
