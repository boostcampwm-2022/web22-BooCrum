import { IsNumber, IsString, Min } from 'class-validator';

export class PartialSearchRequestDto {
  @IsString()
  filter: WORKSPACE_FILTERS;

  @Min(1, { message: 'page는 1 이상의 숫자로 제공해주십시오.' })
  @IsNumber()
  page: number;
}
