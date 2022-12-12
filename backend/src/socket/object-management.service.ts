import { Injectable, Logger } from '@nestjs/common';
import { ObjectMapVO } from './dto/object-map.vo';
import { MongooseObjectHandlerService } from '../object-database/mongoose-object-handler.service';
import { UpdateObjectDTO } from 'src/object-database/dto/update-object.dto';
import { CreateObjectDTO } from 'src/object-database/dto/create-object.dto';

@Injectable()
export class ObjectManagementService {
  constructor(private objectHandlerService: MongooseObjectHandlerService) {}

  /**
   * 특정 워크스페이스 내의 모든 Object를 반환한다.
   *
   * 만약 캐싱되지 않은 경우 DB로부터 정보를 불러와 캐싱한 뒤 반환한다.
   * @param workspaceId 검색할 워크스페이스의 ID
   * @returns 현재 보관 중인 모든 Object 데이터 배열. 없을 경우 빈 배열을 반환한다.
   */
  async findAllObjectsInWorkspace(workspaceId: string): Promise<ObjectMapVO[]> {
    return await this.objectHandlerService.selectAllObjects(workspaceId);
  }

  /**
   * 특정 워크스페이스의 특정 Object를 반환한다.
   *
   * 만약 캐싱되지 않은 경우 DB로부터 모든 정보를 불러와 캐싱한 뒤 탐색한다.
   * @param workspaceId 검색할 워크스페이스의 ID
   * @param objectId 검색할 Object의 ID
   * @returns 지정한 Object에 대한 데이터. 없을 경우 null.
   */
  async findOneObjectInWorkspace(workspaceId: string, objectId: string): Promise<ObjectMapVO> {
    return this.objectHandlerService.selectObjectById(workspaceId, objectId);
  }

  /**
   * 특정 워크스페이스에 새로운 Object를 추가한다. 이미 존재할 경우 오류를 반환한다.
   *
   * 만약 캐싱되지 않은 경우 DB로부터 모든 정보를 불러온 뒤 삽입한다.
   * @param workspaceId Object를 삽입할 워크스페이스의 ID
   * @param objectDto 삽입할 Object에 관한 데이터
   */
  async insertObjectIntoWorkspace(workspaceId: string, objectDto: CreateObjectDTO): Promise<void> {
    await this.objectHandlerService.createObject(workspaceId, objectDto);
  }

  /**
   * 특정 워크스페이스에 존재하는 특정 Object를 갱신한다. 존재하지 않을 경우 오류를 반환한다.
   *
   * 만약 캐싱되지 않은 경우 DB로부터 모든 정보를 불러온 뒤 갱신한다.
   * @param workspaceId Object를 수정할 워크스페이스의 ID
   * @param objectDto 갱신할 Object에 관한 데이터
   */
  async updateObjectInWorkspace(workspaceId: string, objectDto: UpdateObjectDTO): Promise<void> {
    await this.updateObjectInWorkspace(workspaceId, objectDto);
  }

  /**
   * 특정 워크스페이스에 존재하는 특정 Object를 제거한다. 존재하지 않을 경우 무시한다.
   * @param workspaceId Object를 제거할 워크스페이스의 ID
   * @param objectId 제거할 Object의 ID
   */
  async deleteObjectInWorkspace(workspaceId: string, objectId: string): Promise<boolean> {
    return await this.deleteObjectInWorkspace(workspaceId, objectId);
  }
}
