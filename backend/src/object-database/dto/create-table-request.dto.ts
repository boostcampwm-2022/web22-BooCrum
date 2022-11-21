import { IsUUID } from 'class-validator';

export class CreateTableRequestDto {
  @IsUUID()
  workspaceId: string;
}
