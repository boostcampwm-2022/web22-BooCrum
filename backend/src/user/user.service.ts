/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from 'src/team/entity/team-member.entity';
import { WorkspaceMember } from 'src/workspace/entity/workspace-member.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
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
    // 이미 존재하는 사용자이면 해당 사용자 계정 정보를 전달한다.
    if (userFind) {
      return userFind;
    }

    // 없는 사용자이면 사용자를 생성하여 전달한다.
    // TODO: 대충 팀 생성하는 부분
    const newUser = new User();
    // TODO: 대충 팀 Entity를 넣어줌
    newUser.userId = newUserDto.userId;
    newUser.nickname = newUserDto.nickname;
    return await this.userRepository.save(newUser);
  }

  // 사용자 정보를 변경합니다. 단, UserID와 RegisterDate는 변경할 수 없습니다.
  async changeUserData(
    userId: string,
    newData: UserDto,
  ): Promise<UserDto | null> {
    // 지정된 ID의 사용자가 존재하는지 확인한다. 없으면 그대로 return 한다.
    const userFind = await this.userRepository.findOne({
      where: { userId },
    });
    if (!userFind) {
      return null;
    }

    // 존재하면 Update를 진행한다.
    delete newData.userId, newData.registerDate;
    const res = await this.userRepository.update({ userId }, newData);

    if (res.affected !== 0)
      return this.userRepository.findOne({
        where: { userId },
      });
    return null;
  }

  // 사용자 정보를 삭제합니다.
  async deleteUserData(userId: string): Promise<boolean> {
    const userFind = await this.userRepository.findOne({
      where: { userId },
    });
    if (!userFind) return false;
    await this.teamMemberRepository.delete({ user: userFind });
    // TODO: 소유한 워크스페이스 삭제 API 추가 (혹은 구현 안하고 주기적으로 날리는 방법도 있음.) (role 관련해서 시도할 것이 있다고 하여 보류함.)
    // await this.workspaceMemberRepository.delete({ user: userFind });
    return true;
  }

  // 사용자 정보를 가져옵니다.
  // 가져오는 정보는 "사용자 정보 + 소속 팀 및 권한" 입니다.
  async getUserData(userId: string): Promise<User> {
    // Join이 Row마다 이루어지는 것이 아니라, 그냥 배열에 Raw Object가 중첩되어 제공된다.
    return await this.userRepository
      .createQueryBuilder('user')
      .where({ userId: userId })
      .leftJoinAndSelect('user.teamMember', 'teamMember')
      .leftJoinAndSelect('teamMember.team', 'team')
      .select([
        'user.userId',
        'user.nickname',
        'user.registerDate',
        'teamMember.role',
        'team.teamId',
        'team.name',
        'team.description',
        'team.isTeam',
        'team.registerDate',
      ])
      .getOne();
  }
}
