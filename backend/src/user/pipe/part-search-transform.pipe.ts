import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PartialSearchRequestDto } from '../dto/partial-search.dto';

@Injectable()
export class PartSearchTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.metatype !== PartialSearchRequestDto) return value;

    if ((value as Record<string, unknown>).hasOwnProperty('page')) value.page = +value.page;
    return value;
  }
}
