import { IsNumber, IsUUID } from 'class-validator';

export class SelectObjectDTO {
  @IsUUID()
  workspaceId: string;

  objectId: number;
}
