/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from 'src/team/entity/team-member.entity';
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
  ) {}

  async createOrFindUser(newUserDto: UserDto): Promise<User> {
    const userFind = await this.userRepository.findOne({
      where: {
        userId: newUserDto.userId,
      },
    });
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

  async changeUserData(userId: string): Promise<User> {
    const userFind = await this.userRepository.findOne({
      where: { userId },
    });
    if (!userFind) {
      return null; //? 여기에서 Http Exception을 발생시킬까?
    }

    await this.userRepository.update({ userId }, {});
  }

  async getUserData(userId: string): Promise<any> {
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
      .getMany();
  }
}
