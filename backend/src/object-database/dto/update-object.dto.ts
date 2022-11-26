import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateObjectDTO {
  @IsString()
  objectId: string;

  @IsNumber()
  @IsOptional()
  xPos: number;

  @IsNumber()
  @IsOptional()
  yPos: number;

  @IsNumber()
  @IsOptional()
  width: number;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  text: string;
}
