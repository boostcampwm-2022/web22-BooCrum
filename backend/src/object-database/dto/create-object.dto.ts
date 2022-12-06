import { IsNumber, IsOptional, IsString, IsUUID, IsNotEmpty, ValidateIf, IsDefined } from 'class-validator';

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

  @ValidateIf((obj) => ['postit', 'section'].indexOf(obj.type) !== -1)
  @IsString()
  text: string;

  @ValidateIf((obj) => ['postit', 'section'].indexOf(obj.type) !== -1)
  @IsNumber()
  fontSize: number;

  @ValidateIf((obj) => ['draw'].indexOf(obj.type) !== -1)
  @IsString()
  path: string;

  @IsString()
  @IsOptional()
  creator: string;
}
