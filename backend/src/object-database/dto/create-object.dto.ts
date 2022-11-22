import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateObjectDTO {
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
}
