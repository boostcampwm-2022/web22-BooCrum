import { IsNumber, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';

export class CreateObjectDTO implements AbstractWorkspaceObject {
  @IsUUID()
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

  @IsArray()
  @IsOptional()
  path: string;

  @IsString()
  @IsOptional()
  creator: string;
}
