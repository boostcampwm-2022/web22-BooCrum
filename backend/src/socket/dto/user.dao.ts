import { IsNumber, IsString } from 'class-validator';
import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';

export class UserDAO {
  constructor(userId: string, nickname: string, color: string, role: WORKSPACE_ROLE | number) {
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
  role: WORKSPACE_ROLE | number;
}
