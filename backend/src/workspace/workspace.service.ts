/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../team/entity/team.entity';
import { User } from '../user/entity/user.entity';
import { Repository, DataSource } from 'typeorm';
import { WorkspaceCreateRequestDto } from './dto/workspaceCreateRequest.dto';
import { WorkspaceMetadataDto } from './dto/workspaceMetadata.dto';
import { WorkspaceMember } from './entity/workspace-member.entity';
import { Workspace } from './entity/workspace.entity';
import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';
import * as MulterS3 from 'multer-s3';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TemplateBucket, TemplateBucketDocument } from 'src/object-database/schema/template-bucket.schema';
import { ObjectBucket, ObjectBucketDocument } from 'src/object-database/schema/object-bucket.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    private dataSource: DataSource,
    @InjectModel(TemplateBucket.name) private templateBucketModel: Model<TemplateBucketDocument>,
    @InjectModel(ObjectBucket.name) private objectBucketModel: Model<ObjectBucketDocument>,
  ) {}

  async getAuthorityOfUser(workspaceId: string, userId: string): Promise<number> {
    return (
      (
        await this.workspaceMemberRepository
          .createQueryBuilder()
          .where('user_id = :uid', { uid: userId })
          .andWhere('workspace_id = :wid', { wid: workspaceId })
          .getOne()
      )?.role ?? WORKSPACE_ROLE.VIEWER
    );
  }

  async getTemplateList() {
    return await this.templateBucketModel
      .find({}, { templateName: 1, templateId: 1, templateThumbnailUrl: 1, _id: 0 })
      .exec();
  }

  private async createObjectDocument(workspaceId: string, templateId?: string) {
    const newBucket = new this.objectBucketModel();
    newBucket.workspaceId = workspaceId;

    // Template ID??? ???????????? Object Bucket??? ????????????. ????????? ??? Bucket??? ????????????.
    if (templateId) {
      const templateBucket = await this.templateBucketModel.findOne({ templateId }, { objects: 1 }, { lean: true });
      if (templateBucket) newBucket.objects = templateBucket.objects;
    }
    await newBucket.save();
    return true;
  }

  private async deleteObjectDocument(workspaceId: string): Promise<boolean> {
    const ret = await this.objectBucketModel.deleteOne({ workspaceId }).exec();
    return ret.deletedCount > 0;
  }

  /**
   * ????????????????????? ???????????????.
   * @param param0 ????????????????????? ??????????????? ????????? ??????????????????. (?????? ????????????????????? ????????? ???/?????? ID??? ?????????????????? ??????, ??????)
   * @returns ????????? ????????????????????? ????????? ???????????????.
   */
  async createWorkspace(
    { teamId, ownerId: userId, name, description }: WorkspaceCreateRequestDto,
    templateId?: string,
  ): Promise<Workspace> {
    const newWorkspace = new Workspace();
    const workspaceMember = new WorkspaceMember();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const [teamFind, userFind] = await Promise.all([
        await queryRunner.manager.findOne(Team, {
          where: { teamId },
        }),
        await queryRunner.manager.findOne(User, {
          where: { userId },
        }),
      ]);
      if (!teamFind || !userFind) {
        throw new BadRequestException('????????? ????????? ID ?????? ??? ID ?????????.');
      }

      workspaceMember.role = WORKSPACE_ROLE.OWNER;
      workspaceMember.user = userFind;
      workspaceMember.workspace = newWorkspace;

      newWorkspace.team = teamFind;
      newWorkspace.name = name ?? 'untitled';
      newWorkspace.description = description ?? null;
      newWorkspace.team = teamFind;

      const ret = await queryRunner.manager.save(newWorkspace);
      await queryRunner.manager.save(workspaceMember);

      await this.createObjectDocument(ret.workspaceId, templateId);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return ret;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e; // ?????? ???????????? ???????????? ??????.
    }
  }

  /**
   * ?????? ????????????????????? ?????? ?????? ????????? ???????????????. (?????? ??? + ?????????????????? ???????????? + ???????????????)
   * @param workspaceId ?????? ????????????????????? ?????? ID ????????????.
   * @return ?????? ????????????????????? ?????? ?????? ????????? ???????????????.
   */
  async getWorkspaceData(workspaceId: string): Promise<Workspace> {
    return await this.workspaceRepository
      .createQueryBuilder('ws')
      .where('ws.workspace_id = :id', { id: workspaceId })
      .leftJoinAndSelect('ws.workspaceMember', 'wm')
      .leftJoinAndSelect('ws.team', 'team')
      .leftJoinAndSelect('wm.user', 'user')
      .select()
      .getOne();
  }

  /**
   * ?????? ????????????????????? ??????????????? ????????? ???????????? ????????? ???????????????.
   * @param workspaceId ?????? ????????????????????? ?????? ID ????????????.
   * @returns ?????? ????????????????????? ????????? ???????????? ???????????????.
   */
  async getWorkspaceParticipantList(workspaceId: string): Promise<WorkspaceMember[]> {
    return await this.workspaceMemberRepository
      .createQueryBuilder('wm')
      .where('wm.workspace_id = :id', { id: workspaceId })
      .leftJoinAndSelect('wm.user', 'user')
      .getMany();
  }

  /**
   * ?????? ????????????????????? ?????????????????? ???????????????.
   * @param workspaceId ?????? ????????????????????? ?????? ID ????????????.
   * @returns ?????? ????????????????????? ?????????????????? ???????????????.
   */
  async getWorkspaceMetadata(workspaceId: string): Promise<Workspace> {
    return await this.workspaceRepository.findOne({
      where: { workspaceId },
    });
  }

  async getWorkspaceOwnerTeam(workspaceId: string): Promise<Team | null> {
    return (
      await this.workspaceRepository
        .createQueryBuilder('w')
        .where({ workspaceId })
        .leftJoinAndSelect('w.team', 'team')
        .getOne()
    ).team;
  }

  /**
   * ?????? ????????? ????????? Workspace ????????? ???????????????.
   * @param userId ?????? ID ?????????.
   * @returns Workspace ????????? ???????????????.
   */
  async getUserOwnWorkspaceList(userId: string): Promise<WorkspaceMember[]> {
    return await this.workspaceMemberRepository
      .createQueryBuilder('wm')
      .where('wm.user_id = :id', { id: userId })
      .leftJoinAndSelect('wm.workspace', 'ws')
      .select(['wm.role', 'ws'])
      .getMany();
  }

  /**
   * ?????? ?????? ????????? Workspace ????????? ???????????????.
   * @param teamId ??? ID ?????????.
   * @returns Workspace ????????? ???????????????.
   */
  async getTeamOwnWorkspaceList(teamId: number): Promise<Workspace[]> {
    return await this.workspaceRepository
      .createQueryBuilder('ws')
      .leftJoin('ws.team', 'team')
      .where('team.team_id = :id', { id: teamId })
      .getMany();
  }

  /**
   * ???????????? ????????????????????? ???????????????.
   * @param userId ?????? ID ?????????.
   * @param workspaceId ?????????????????? ID ?????????.
   * @param role ????????? ?????? ????????????????????? ????????? ???????????????.
   * @returns ?????? ????????? ???????????????.
   */
  async addUserIntoWorkspace(
    userId: string,
    workspaceId: string,
    role = WORKSPACE_ROLE.VIEWER,
  ): Promise<WorkspaceMember> {
    const userFind = await this.workspaceMemberRepository
      .createQueryBuilder('wm')
      .where('wm.user_id = :id', { id: userId })
      .andWhere('wm.workspace_id = :id', { id: workspaceId })
      .getOne();
    if (userFind) throw new BadRequestException('?????? ???????????? ??????????????????.');

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let newMember = new WorkspaceMember();
      newMember.role = role;
      newMember.user = await queryRunner.manager.findOne(User, {
        where: { userId },
      });
      newMember.workspace = await queryRunner.manager.findOne(Workspace, {
        where: { workspaceId },
      });
      if (!newMember.user || !newMember.workspace)
        throw new BadRequestException('????????? ????????? Id ?????? ?????????????????? Id?????????.');
      newMember = await queryRunner.manager.save(newMember);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      delete newMember.id;
      return newMember;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }

  /**
   * ????????????????????? ???????????????.
   *
   * ???????????? ????????? ???????????? ????????????. ?????? ??? ????????? ?????????????????? ????????????.
   * @param workspaceId ????????? ????????????????????? Id?????????.
   */
  async deleteWorkspace(workspaceId: string): Promise<void> {
    const workspaceFind = await this.workspaceRepository.find({
      where: { workspaceId },
    });
    if (!workspaceFind) {
      throw new BadRequestException('????????? ?????????????????? ID ?????????.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Team?????? Workspace ?????? (One To Many??? Many??? ?????? ???????????? ?????? ??????? ??? ??????)
      // workspaceMember?????? ?????? ?????? ?????? ??????
      await this.workspaceMemberRepository
        .createQueryBuilder('wm', queryRunner)
        .delete()
        .where('workspace_id = :id', { id: workspaceId })
        .execute();
      // ?????????????????? ??????????????? ??????
      await queryRunner.manager.delete(Workspace, { workspaceId });

      await this.deleteObjectDocument(workspaceId);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw e;
    }
  }

  /**
   * ????????????????????? ?????????????????? ???????????????.
   *
   * ???????????? ????????? ???????????? ????????????. ?????? ?????? ????????? ?????????????????? ????????????.
   * @param workspaceId ?????????????????? ????????? ????????????????????? ID?????????.
   * @param newMetaData ????????? ??????????????? ???????????????.
   * @returns ?????? ????????? ?????? ????????? ?????? true??? ???????????????.
   */
  async updateWorkspaceMetadata(workspaceId: string, newMetaData: WorkspaceMetadataDto): Promise<boolean> {
    const workspaceFind = this.workspaceRepository.findOne({
      where: { workspaceId },
    });
    if (!workspaceFind) throw new BadRequestException('????????? ?????????????????? ID?????????.');
    return (
      (
        await this.workspaceRepository.update(
          { workspaceId },
          { ...newMetaData, updateDate: () => 'CURRENT_TIMESTAMP' },
        )
      ).affected > 0
    );
  }

  /**
   * ???????????? ????????????????????? ?????? ????????? ???????????????.
   *
   * ???????????? ????????? ???????????? ????????????. ?????? ?????? ????????? ?????????????????? ????????????.
   * @param workspaceId ?????? ?????? ????????? ?????????????????? ID?????????.
   * @param userId ?????? ?????? ????????? ????????? ID ?????????.
   * @param newRole ????????? Role??? ???????????????.
   */
  async updateUesrAuthority(workspaceId: string, userId: string, newRole: number): Promise<boolean> {
    return (
      (
        await this.workspaceMemberRepository
          .createQueryBuilder()
          .update({ role: newRole })
          .where('workspace_id = :wid', { wid: workspaceId })
          .andWhere('user_id = :uid', { uid: userId })
          .execute()
      ).affected > 0
    );
  }

  /**
   * ????????????????????? ?????? ???????????? ????????? ???????????????.
   *
   * 0: Viewer, 1: Editor, 2: Admin
   * @param workspaceId   ????????? ????????? ?????????????????? ID?????????.
   * @param userId        ????????? ????????? ????????? ID ?????????.
   */
  async getWorkspaceAuthority(workspaceId: string, userId: string) {
    const member = await this.workspaceMemberRepository
      .createQueryBuilder()
      .select()
      .where('workspace_id = :workspaceId', { workspaceId })
      .andWhere('user_id = :userId', { userId })
      .getOne();

    return !member ? WORKSPACE_ROLE.NOT_FOUND : member.role;
  }

  /**
   *
   * @param workspaceId   ???????????? ????????? ?????????????????? ID
   * @param file          ???????????? ????????? ????????? ??????
   * @returns             ????????? ?????? ?????? ?????? ??????
   */
  async uploadThumbnail(workspaceId: string, file: MulterS3.File): Promise<boolean> {
    const isExistWorkspace = await this.getWorkspaceMetadata(workspaceId);
    if (!isExistWorkspace) throw new BadRequestException('????????? ?????????????????? ID?????????.');
    if (!file) throw new NotFoundException('????????? ????????? ???????????? ????????????.');

    const thumbnailUrl = file.location;
    return (
      (
        await this.workspaceRepository
          .createQueryBuilder()
          .update({ thumbnailUrl })
          .where('workspace_id = :workspaceId', { workspaceId })
          .execute()
      ).affected > 0
    );
  }
}
