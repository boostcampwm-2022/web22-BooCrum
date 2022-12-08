import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { CreateObjectDTO } from 'src/object-database/dto/create-object.dto';
import { UpdateObjectDTO } from 'src/object-database/dto/update-object.dto';

const isNullOrUndefined = (v: any): boolean => v === null || v === undefined;

/**
 * Validation Pipe를 거친 Object Dto에 대해 추가적인 수정을 가합니다.
 */
@Injectable()
export class ObjectTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    switch (metadata.metatype) {
      case CreateObjectDTO:
      case UpdateObjectDTO:
        break;
      default:
        throw new Error('잘못된 사용법입니다. Create/UpdateObjectDTO에 대해서만 사용해주시기 바랍니다.');
    }
    return this.tranformEntryPoint(value);
  }

  private tranformEntryPoint(obj: AbstractPartialWorkspaceObject) {
    delete obj.creator;
    switch (obj.type) {
      case 'postit':
        return this.postitTransformer(obj);
      case 'section':
        return this.sectionTransformer(obj);
      case 'draw':
        return this.drawTransformer(obj);
      default:
        throw new WsException('Validation Error: 잘못된 Type 전달입니다.');
    }
  }

  private postitTransformer(obj: AbstractPartialWorkspaceObject) {
    // 없애야 할 데이터를 제거한다.
    delete obj.path;
    if (!isNullOrUndefined(obj.fontSize) && obj.fontSize <= 0)
      throw new WsException('Font 크기는 0 이하가 될 수 없습니다.');

    return obj;
  }

  private sectionTransformer(obj: AbstractPartialWorkspaceObject) {
    // 없애야 할 데이터를 제거한다.
    delete obj.path;

    // 데이터를 제어합니다.
    if (!isNullOrUndefined(obj.fontSize) && obj.fontSize <= 0)
      throw new WsException('Font 크기는 0 이하가 될 수 없습니다.');
    if (!isNullOrUndefined(obj.text) && obj.text.length > 50) obj.text = obj.text.slice(0, 50); // 오류 대신 50자로 잘라버린다.
    return obj;
  }

  private drawTransformer(obj: AbstractPartialWorkspaceObject) {
    // 없애야 할 데이터를 제거한다.
    delete obj.text;
    delete obj.fontSize;

    return obj;
  }
}
