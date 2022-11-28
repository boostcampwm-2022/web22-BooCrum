import { IsNumber, IsString } from 'class-validator';

export class UserDAO {
  constructor(userId: string, nickname: string, color: string, role: number) {
    this.userId = userId;
    this.nickname = nickname;
    this.color = color;
    this.role = role;
  }

  @IsString()
  userId: string;

  @IsString()
  nickname: string;

  @IsString()
  color: string;

  @IsNumber()
  role: number;
}
