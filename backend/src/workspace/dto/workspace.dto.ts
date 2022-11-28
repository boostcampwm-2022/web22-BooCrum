import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

export class WorkspaceDto {
  @IsUUID()
  workspaceId?: string;

  @IsNumber()
  teamId?: number;

  @IsString()
  description?: string;

  @IsString()
  name?: string;

  @IsDate()
  registerDate: Date;

  @IsDate()
  updateDate: number;

  workspaceMember?: string[];
}
