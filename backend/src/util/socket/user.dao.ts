import { IsString } from 'class-validator';

export class UserDAO {
  constructor(userId: string, nickname: string, color: string) {
    this.userId = userId;
    this.nickname = nickname;
    this.color = color;
  }

  @IsString()
  userId: string;

  @IsString()
  nickname: string;

  @IsString()
  color: string;
}
