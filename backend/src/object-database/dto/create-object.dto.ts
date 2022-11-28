import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateObjectDTO {
  @IsString()
  objectId: string;

  @IsString()
  type: string;

  @IsNumber()
  left: number;

  @IsNumber()
  top: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsString()
  color: string;

  @IsString()
  @IsOptional()
  text: string;

  @IsNumber()
  @IsOptional()
  fontsize: number;

  @IsString()
  creator: string;

  @IsUUID()
  @IsOptional()
  workspaceId: string;
}
