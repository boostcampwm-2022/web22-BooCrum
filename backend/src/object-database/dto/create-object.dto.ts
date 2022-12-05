import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateObjectDTO {
  @IsString()
  objectId: string;

  @IsString()
  type: ObjectType;

  @IsNumber()
  left: number;

  @IsNumber()
  top: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  scaleX: number;

  @IsNumber()
  scaleY: number;

  @IsString()
  color: string;

  @IsString()
  @IsOptional()
  text: string;

  @IsNumber()
  @IsOptional()
  fontSize: number;

  @IsString()
  creator: string;

  @IsUUID()
  @IsOptional()
  workspaceId: string;
}
