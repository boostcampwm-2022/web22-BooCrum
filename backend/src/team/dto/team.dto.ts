import { IsNotEmpty, isString, MaxLength } from 'class-validator';

// 팀 생성 시 팀명과 userId를 필수로 받아와야 하므로 DTO 생성하였음
export class TeamDTO {
  @IsNotEmpty()
  @MaxLength(50)
  userId: string;

  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @MaxLength(1024)
  description: string;
}
