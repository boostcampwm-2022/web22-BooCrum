import { IsOptional, IsString } from 'class-validator';

export class WorkspaceMetadataDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  name: string;
}
