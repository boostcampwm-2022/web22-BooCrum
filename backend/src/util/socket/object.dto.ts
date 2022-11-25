import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ObjectDTO {
  @IsString()
  objectId: string;

  @IsUUID()
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
  text: string;

  @IsString()
  creator: string;
}
