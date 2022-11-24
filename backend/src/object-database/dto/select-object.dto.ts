import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SelectObjectDTO {
  @IsUUID()
  @IsOptional()
  workspaceId: string;

  @IsString()
  objectId: string;
}
