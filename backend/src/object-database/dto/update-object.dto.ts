import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateObjectDTO {
  @IsString()
  objectId: string;

  @IsNumber()
  @IsOptional()
  left: number;

  @IsNumber()
  @IsOptional()
  top: number;

  @IsNumber()
  width: number;

  @IsNumber()
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
}
