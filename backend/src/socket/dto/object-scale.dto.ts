import { IsNumber, IsString } from 'class-validator';

export class ObjectScaleDTO {
  @IsString()
  objectId: string;

  @IsNumber()
  dleft: number;

  @IsNumber()
  dtop: number;

  @IsNumber()
  scaleX;

  @IsNumber()
  scaleY;
}
