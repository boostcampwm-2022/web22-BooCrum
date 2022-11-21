import { IsNumber, IsString, IsOptional, IsEmpty } from 'class-validator';

export class WorkspaceCreateRequestDto {
  @IsNumber()
  teamId: number;

  @IsEmpty() // 현재는 외부 입력은 없으며, Session 정보를 그대로 활용한다.
  ownerId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
