import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateObjectDTO implements AbstractPartialWorkspaceObject {
  @IsString()
  objectId: string;

  @IsString()
  @IsOptional()
  type: ObjectType;

  @IsNumber()
  @IsOptional()
  left: number;

  @IsNumber()
  @IsOptional()
  top: number;

  @IsNumber()
  @IsOptional()
  width: number;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsNumber()
  @IsOptional()
  scaleX: number;

  @IsNumber()
  @IsOptional()
  scaleY: number;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  text: string;

  @IsNumber()
  @IsOptional()
  fontSize: number;

  @IsString()
  @IsOptional()
  path: string;
}
