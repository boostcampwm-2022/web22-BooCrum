import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ObjectDTO {
  @IsString()
  objectId: string;

  @IsUUID()
  @IsOptional()
  workspaceId: string;

  @IsString()
  type: string;

  @IsNumber()
  xPos: number;

  @IsNumber()
  yPos: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsString()
  color: string;

  @IsString()
  @IsOptional()
  text: string;

  @IsString()
  @IsOptional()
  creator: string;
}
