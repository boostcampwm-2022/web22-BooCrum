import { IsNumber, IsString } from 'class-validator';

export class ObjectMoveDTO {
  @IsString()
  objectId: string;

  @IsNumber()
  dleft: number;

  @IsNumber()
  dtop: number;
}
