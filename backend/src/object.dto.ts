import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ObjectDTO {
  @IsString()
  objectId: string;

  @IsUUID()
  workspaceId: string;

  @IsNumber()
  type: number;

  @IsNumber()
  x_pos: number;

  @IsNumber()
  y_pos: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsString()
  color: string;

  @IsString()
  text: string;

  @IsString()
  craetor: string;
}
