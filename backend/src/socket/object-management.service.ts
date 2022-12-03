import { Injectable, Logger } from '@nestjs/common';
import { ObjectHandlerService } from '../object-database/object-handler.service';
import { WorkspaceObjectMapper } from 'src/types/socket';
import { ObjectMapVO } from './dto/object-map.vo';
import { ObjectDTO } from './dto/object.dto';

@Injectable()
export class ObjectManagementService {
  private workspaceObjectDataMap = new Map<string, WorkspaceObjectMapper>();
  private logger: Logger = new Logger('ObjectManagementService');

  constructor(private objectHandlerService: ObjectHandlerService) {}

  /**
   * 캐싱 여부와 무관하게, 지정한 워크스페이스의 Object 데이터를 가져와 모두 캐싱한다.
   * @param workspaceId Object를 캐싱할 Workspace의 ID
   */
  private async cacheWorkspaceObjects(workspaceId: string): Promise<void> {
    if (this.workspaceObjectDataMap.has(workspaceId)) {
      this.cancelTimeoutOnWorkspaceCache(workspaceId);
    }

    const objectDataMapper: WorkspaceObjectMapper = {
      timeout: null,
      objects: new Map<string, ObjectMapVO>(),
    };
    (await this.objectHandlerService.selectAllObjects(workspaceId)).forEach((obj) =>
      objectDataMapper.objects.set(obj.objectId, obj),
    );
    this.workspaceObjectDataMap.set(workspaceId, objectDataMapper);
    this.setTimeoutOnWorkspaceCache(workspaceId, 1000 * 60 * 10); // 캐싱 수명은 10분으로 설정한다.
    this.logger.log(`Workspace Object 캐싱 추가: ${workspaceId}`);
  }

  /**
   * 캐싱된 특정 워크스페이스의 캐싱 데이터를 지정한 밀리초 뒤에 제거합니다.
   *
   * 만약 이미 삭제 예약이 걸린 경우, 이를 제거한 뒤 다시 설정합니다.
   * @param workspaceId 캐시를 제거하고자 하는 Workspace의 ID
   * @param delayMs 삭제 예약 시간 (기본 10분)
   */
  setTimeoutOnWorkspaceCache(workspaceId: string, delayMs: number = 1000 * 60 * 10): void {
    if (!this.workspaceObjectDataMap.has(workspaceId)) return;

    this.cancelTimeoutOnWorkspaceCache(workspaceId);
    const objectMapper = this.workspaceObjectDataMap.get(workspaceId);
    objectMapper.timeout = setTimeout(() => this.deleteWorkspaceCache(workspaceId), delayMs);
  }

  /**
   * 캐싱된 워크스페이스의 캐시 제거 예약을 취소한다.
   * @param workspaceId 캐시 제거 예약을 취소할 워크스페이스의 ID
   */
  cancelTimeoutOnWorkspaceCache(workspaceId: string): void {
    const objectMapper = this.workspaceObjectDataMap.get(workspaceId);
    if (!objectMapper || objectMapper.timeout === null) return;
    clearTimeout(objectMapper.timeout);
    objectMapper.timeout = null;
  }

  /**
   * 캐시 제거 예약을 초기화한다. 예약이 없을 경우 오류를 반환한다.
   * @param workspaceId 예약을 초기화할 워크스페이스의 ID
   */
  refreshTimeoutOnWorkspace(workspaceId: string): void {
    if (!this.workspaceObjectDataMap.has(workspaceId)) throw new Error('타이머가 존재하지 않습니다.');
    const objectMapper = this.workspaceObjectDataMap.get(workspaceId);
    objectMapper.timeout.refresh();
  }

  /**
   * 캐싱된 특정 워크스페이스의 캐싱 데이터를 즉시 제거합니다.
   * @param workspaceId 캐시를 제거하고자 하는 Workspace의 ID
   */
  deleteWorkspaceCache(workspaceId: string): void {
    if (!this.workspaceObjectDataMap.has(workspaceId)) return;
    this.cancelTimeoutOnWorkspaceCache(workspaceId); // 타임아웃 제거.
    if (this.workspaceObjectDataMap.delete(workspaceId)) this.logger.log(`Workspace Object 캐싱 해제: ${workspaceId}`);
  }

  /**
   * (private) 특정 워크스페이스의 캐싱 여부를 판단하여 없다면 캐싱할 데이터를 가져오고,
   * 있다면 삭제 예약을 초기화한다.
   * @param workspaceId 캐싱할 워크스페이스 ID
   */
  private async saveOrRefreshCache(workspaceId: string): Promise<void> {
    if (!this.workspaceObjectDataMap.has(workspaceId)) await this.cacheWorkspaceObjects(workspaceId);
    else this.refreshTimeoutOnWorkspace(workspaceId);
  }

  /**
   * 특정 워크스페이스 내의 모든 Object를 반환한다.
   *
   * 만약 캐싱되지 않은 경우 DB로부터 정보를 불러와 캐싱한 뒤 반환한다.
   * @param workspaceId 검색할 워크스페이스의 ID
   * @returns 현재 보관 중인 모든 Object 데이터 배열. 없을 경우 빈 배열을 반환한다.
   */
  async findAllObjectsInWorkspace(workspaceId: string): Promise<ObjectMapVO[]> {
    await this.saveOrRefreshCache(workspaceId);

    const cachedData = this.workspaceObjectDataMap.get(workspaceId);
    return [...cachedData.objects.values()];
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
    await this.saveOrRefreshCache(workspaceId);
    return this.workspaceObjectDataMap.get(workspaceId)?.objects.get(objectId) ?? null;
  }

  /**
   * 특정 워크스페이스에 새로운 Object를 추가한다. 이미 존재할 경우 오류를 반환한다.
   *
   * 만약 캐싱되지 않은 경우 DB로부터 모든 정보를 불러온 뒤 삽입한다.
   * @param workspaceId Object를 삽입할 워크스페이스의 ID
   * @param objectDto 삽입할 Object에 관한 데이터
   */
  async insertObjectIntoWorkspace(workspaceId: string, objectDto: ObjectDTO): Promise<void> {
    await this.saveOrRefreshCache(workspaceId);

    const objectMapper = this.workspaceObjectDataMap.get(workspaceId);
    if (objectMapper.objects.has(objectDto.objectId)) throw new Error(`이미 존재하는 Object ID: ${objectDto.objectId}`);
    objectMapper.objects.set(objectDto.objectId, objectDto);
    this.objectHandlerService
      .createObject(workspaceId, objectDto)
      .then((success) => {
        if (success) return;
        objectMapper.objects.delete(objectDto.objectId);
        this.logger.error(
          `Insert Fatal Error: Failed to update data on Database\nWorkspace ID: ${workspaceId}\nObject ID: ${objectDto.objectId}`,
        );
      })
      .catch((reason) => {
        objectMapper.objects.delete(objectDto.objectId);
        this.logger.error(
          `Insert Fatal Error: Failed to update data on Database\nWorkspace ID: ${workspaceId}\nObject ID: ${objectDto.objectId}\nReason: ${reason}`,
        );
      });
  }

  /**
   * 특정 워크스페이스에 존재하는 특정 Object를 갱신한다. 존재하지 않을 경우 오류를 반환한다.
   *
   * 만약 캐싱되지 않은 경우 DB로부터 모든 정보를 불러온 뒤 갱신한다.
   * @param workspaceId Object를 수정할 워크스페이스의 ID
   * @param objectDto 갱신할 Object에 관한 데이터
   */
  async updateObjectInWorkspace(workspaceId: string, objectDto: ObjectDTO): Promise<void> {
    await this.saveOrRefreshCache(workspaceId);

    // 업데이트 목적 메서드에 네이밍을 달아준다.
    const updateCacheData = (modified, reserved) => Object.assign(modified, reserved);

    //
    const objectMapper = this.workspaceObjectDataMap.get(workspaceId);
    if (!objectMapper.objects.has(objectDto.objectId))
      throw new Error(`존재하지 않는 Object ID: ${objectDto.objectId}`);

    const modifiedData = objectMapper.objects.get(objectDto.objectId);
    const reservedData = { ...modifiedData };
    updateCacheData(modifiedData, objectDto);

    // DB 반영 시도, 실패 시 Cache Rollback
    // DB 대기 없이 수행하기 위해 callback으로. 문제 발생 시 await 로직으로 변경할 것.
    this.objectHandlerService
      .updateObject(workspaceId, objectDto)
      .then((res) => {
        if (res) return;
        updateCacheData(modifiedData, reservedData);
        this.logger.error(
          `Update Fatal Error: Failed to update data on Database\nWorkspace ID: ${workspaceId}\nObject ID: ${objectDto.objectId}`,
        );
      })
      .catch((reason) => {
        updateCacheData(modifiedData, reservedData);
        this.logger.error(
          `Update Fatal Error: Failed to update data on Database\nWorkspace ID: ${workspaceId}\nObject ID: ${objectDto.objectId}\nReason: ${reason}`,
        );
      });
  }

  /**
   * 특정 워크스페이스에 존재하는 특정 Object를 제거한다. 존재하지 않을 경우 무시한다.
   * @param workspaceId Object를 제거할 워크스페이스의 ID
   * @param objectId 제거할 Object의 ID
   */
  async deleteObjectInWorkspace(workspaceId: string, objectId: string): Promise<void> {
    await this.saveOrRefreshCache(workspaceId);

    const objectMapper = this.workspaceObjectDataMap.get(workspaceId);
    if (!objectMapper?.objects.has(objectId)) return;
    const reservedData = objectMapper.objects.get(objectId);
    objectMapper.objects.delete(objectId);
    // DB 반영하자고 굳이 반환이 느려지느니, await 안박고 나중에 처리하도록 두겠다.
    this.objectHandlerService
      .deleteObject(workspaceId, objectId)
      .then((success) => {
        if (success) return;
        objectMapper.objects.set(objectId, reservedData); // DB 삭제 실패 시 캐시를 다시 복구함.
        this.logger.error(
          `Delete Fatal Error: Failed to delete data on Database\nWorkspace ID: ${workspaceId}\nObject ID: ${objectId}`,
        );
      })
      .catch((reason) => {
        objectMapper.objects.set(objectId, reservedData); // DB 삭제 실패 시 캐시를 다시 복구함.
        this.logger.error(
          `Delete Fatal Error: Failed to delete data on Database\nWorkspace ID: ${workspaceId}\nObject ID: ${objectId}\nReason: ${reason}`,
        );
      });
  }
}
