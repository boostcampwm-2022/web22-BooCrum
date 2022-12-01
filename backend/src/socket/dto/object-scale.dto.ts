import { IsNumber, IsString } from 'class-validator';

export class ObjectScaleDTO {
  @IsString()
  objectId: string;

  // @IsNumber()
  // dleft: number;
  //
  // @IsNumber()
  // dtop: number;

  @IsNumber()
  left: number;

  @IsNumber()
  top: number;

  @IsNumber()
  scaleX: number;

  @IsNumber()
  scaleY: number;
}
