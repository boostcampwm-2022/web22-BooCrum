import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { CreateObjectDTO } from 'src/object-database/dto/create-object.dto';
import { UpdateObjectDTO } from 'src/object-database/dto/update-object.dto';

const isNullOrUndefined = (v: any): boolean => v === null || v === undefined;

/**
 * Validation Pipe를 거친 Object Dto에 대해 추가적인 수정을 가합니다.
 */
@Injectable()
export class ObjectUpdatingPipe {
  transform(value: any, metadata: ArgumentMetadata) {
    switch (metadata.metatype) {
      case UpdateObjectDTO:
        break;
      default:
        throw new Error('잘못된 사용법입니다. UpdateObjectDTO에 대해서만 사용해주시기 바랍니다.');
    }
    return value;
  }
}
