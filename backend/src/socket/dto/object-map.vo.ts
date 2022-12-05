import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ObjectMapVO {
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
  text?: string;

  @IsNumber()
  @IsOptional()
  fontSize?: number;

  @IsOptional()
  path?: number[][];

  @IsString()
  @IsOptional()
  creator: string;
}
