import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ObjectDTO {
  // constructor(userId: string, workspaceId: string, role: number, color: string) {
  //   this.userId = userId;
  //   this.workspaceId = workspaceId;
  //   this.role = role;
  //   this.color = color;
  // }

  objectId: string;

  @IsUUID()
  workspaceId: string;

  @IsNumber()
  type: number;

  @IsNumber()
  x_pos: number; // 커서 색상

  @IsNumber()
  y_pos: number; // 커서 색상

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
