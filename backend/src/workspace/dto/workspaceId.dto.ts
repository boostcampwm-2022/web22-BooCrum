import { IsUUID } from 'class-validator';

export class WorkspaceIdDto {
  @IsUUID()
  workspaceId: string;
}
