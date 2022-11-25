import { IsString } from 'class-validator';

export class UserDAO {
  constructor(userId: string, nickname: string) {
    this.userId = userId;
    this.nickname = nickname;
  }

  @IsString()
  userId: string;

  @IsString()
  nickname: string;
}
