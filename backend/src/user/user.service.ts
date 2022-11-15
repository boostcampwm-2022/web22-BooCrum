/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}
