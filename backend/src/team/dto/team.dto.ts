import { IsNotEmpty } from 'class-validator';

// 팀 생성 시 팀명과 userId를 필수로 받아와야 하므로 DTO 생성하였음
export class TeamDTO {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  name: string;

  description: string;
}
