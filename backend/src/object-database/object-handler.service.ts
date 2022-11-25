import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, QueryRunner } from 'typeorm';

import { Workspace } from '../workspace/entity/workspace.entity';
import { CreateObjectDTO } from './dto/create-object.dto';
import { UpdateObjectDTO } from './dto/update-object.dto';
import { WorkspaceObject } from './entity/workspace-object.entity';

@Injectable()
export class ObjectHandlerService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(WorkspaceObject)
    private objectRepository: Repository<WorkspaceObject>,
  ) {}

  private async findWorkspace(workspaceId: string, usedQueryRunner?: QueryRunner): Promise<Workspace> {
    if (typeof workspaceId !== 'string') throw new Error('잘못된 인자 제공');
    if (workspaceId === null || workspaceId === undefined) return null;

    const queryRunner = usedQueryRunner ? usedQueryRunner : this.dataSource.createQueryRunner();
    if (!usedQueryRunner) await queryRunner.connect();
    try {
      const workspaceFound = await queryRunner.manager.findOne(Workspace, { where: { workspaceId } });
      return workspaceFound;
    } catch (e) {
      throw e;
    } finally {
      if (!usedQueryRunner) await queryRunner.release();
    }
  }

  /**
   * 주어진 Dto를 이용하여 Workspace Object를 생성하고 이를 DB에 저장합니다.
   * @param workspaceId 새로운 Object를 저장할 Workspace ID
   * @param createObjectDTO 새로 생성할 Object의 속성을 담은 Dto
   * @returns DB에 저장하여 나온 Entity
   */
  async createObject(workspaceId: string, createObjectDTO: CreateObjectDTO): Promise<boolean> {
    const workspaceFound = await this.findWorkspace(workspaceId);
    if (!workspaceFound) throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');
    const newObject = this.objectRepository.create({ ...createObjectDTO, workspace: workspaceFound });
    try {
      const res = await this.objectRepository.insert(newObject);
      return res.raw.affectedRows > 0;
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') throw new BadRequestException('이미 존재하는 Object ID 입니다.');
      throw e;
    }
  }

  async selectAllObjects(workspaceId: string): Promise<WorkspaceObject[]> {
    // 지정한 워크스페이스가 존재하는지 확인합니다.
    // ? 근데 진짜 필요한가? 없으면 그냥 []만 보내줘도 되는거 아닌가?
    if (!(await this.findWorkspace(workspaceId))) {
      throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');
    }

    return await this.objectRepository
      .createQueryBuilder('wo')
      .select()
      .where('workspace_id = :wid', { wid: workspaceId })
      .getMany();
  }

  /**
   * Object Id를 기반으로 워크스페이스 상의 Object를 반환합니다.
   *
   * workspace가 null / undefined가 아닐 경우, 해당 Object가 지정 워크스페이스에 존재하는지 검증합니다.
   * @param workspaceId Object가 존재하는 Workspace의 ID. (null / undefined 시 검증 생략)
   * @param objectId 특정 Object의 식별자.
   * @returns 존재하고, 검증 성공 시 WorkspaceObject를 반환하며, 아닐 경우 null을 반환한다.
   */
  async selectObjectById(workspaceId: string, objectId: string): Promise<WorkspaceObject> {
    // Workspace가 존재할 경우, 해당 워크스페이스가 존재하는지 또한 판단해준다.
    const workspaceIdServed = workspaceId !== null && workspaceId !== undefined;
    if (workspaceIdServed && !(await this.findWorkspace(workspaceId))) {
      throw new BadRequestException('잘못된 워크스페이스 ID 입니다.');
    }
    const objectFind = await this.objectRepository.findOne({ where: { objectId }, relations: ['workspace'] });
    // workspaceId가 제공된 경우, 해당 Object가 지정 워크스페이스 내부에 존재하는지 검증한다.
    // 있으면 찾은 것을 반환하며,없을 경우 null을 반환한다.
    if (!objectFind) throw new BadRequestException('존재하지 않는 객체입니다.');
    if (workspaceIdServed && objectFind.workspace.workspaceId !== workspaceId) return null;
    return objectFind;
  }

  /**
   * Object Id를 기반으로 워크스페이스 상의 Object를 갱신합니다.
   * @param workspaceId Object가 존재하는 Workspace의 ID. (null / undefined 시 검증 생략)
   * @param objectId 특정 Object의 식별자.
   * @param updateObjectDTO 수정하기를 원하는 값
   * @returns 성공할 경우 true, 실패할 경우 false를 반환합니다.
   */
  async updateObject(workspaceId: string, updateObjectDTO: UpdateObjectDTO): Promise<boolean> {
    // selectObjectById에서 워크스페이스 및 오브젝트 존재 여부를 검증하므로, 여기서 검증은 생략한다.
    const object = await this.selectObjectById(workspaceId, updateObjectDTO.objectId);
    const res = await this.objectRepository.update(object.objectId, updateObjectDTO);
    return res.affected > 0;
  }

  /**
   * Object Id를 기반으로 워크스페이스 상의 Object를 제거합니다.
   * @param workspaceId Object가 존재하는 Workspace의 ID. (null / undefined 시 검증 생략)
   * @param objectId 특정 Object의 식별자.
   * @returns 삭제 성공 시 true, 실패 시 false를 반환합니다.
   */
  async deleteObject(workspaceId: string, objectId: string): Promise<boolean> {
    // selectObjectById에서 워크스페이스 및 오브젝트 존재 여부를 검증하므로, 여기서 검증은 생략한다.
    const object = await this.selectObjectById(workspaceId, objectId);
    const res = await this.objectRepository.delete(object.objectId);
    return res.affected > 0;
  }
}
