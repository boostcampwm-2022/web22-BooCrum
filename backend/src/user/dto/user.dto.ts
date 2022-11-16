import { IsNumber, IsString, MaxLength } from 'class-validator';

export class UserDto {
  @IsString()
  userId?: string;

  @MaxLength(50)
  @IsString()
  nickname?: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  registerDate?: number;
}
