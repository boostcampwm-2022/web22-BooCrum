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

  @IsNumber()
  @IsOptional()
  fontsize: number;
}
