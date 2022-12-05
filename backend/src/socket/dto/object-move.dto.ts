import { IsNumber, IsString } from 'class-validator';

export class ObjectMoveDTO {
  @IsString()
  objectId: string;

  @IsNumber()
  left: number;

  @IsNumber()
  top: number;
}
