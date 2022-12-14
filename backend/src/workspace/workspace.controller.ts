/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Session,
  Param,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Query,
  UseGuards,
  ValidationPipe,
  BadRequestException,
  ForbiddenException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/guard/session.guard';
import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';
import { WorkspaceCreateRequestDto } from './dto/workspaceCreateRequest.dto';
import { WorkspaceIdDto } from './dto/workspaceId.dto';
import { WorkspaceMetadataDto } from './dto/workspaceMetadata.dto';
import { Workspace } from './entity/workspace.entity';
import { WorkspaceService } from './workspace.service';
import * as MulterS3 from 'multer-s3';
import { ThumbnailInterceptor } from 'src/workspace/file-interceptor/thumbnail.interceptor';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  private async hasProperAuthority(workspaceId: string, userId: string, authority: number): Promise<boolean> {
    return (await this.workspaceService.getAuthorityOfUser(workspaceId, userId)) >= authority;
  }

  @UseGuards(AuthorizationGuard)
  @Post()
  async createWorkspace(
    @Body(new ValidationPipe()) body: WorkspaceCreateRequestDto,
    @Query('templateId') templateId: string,
    @Session() session: Record<string, any>,
  ): Promise<Workspace> {
    body.ownerId = session.user.userId;
    if (!body.teamId) body.teamId = session.user.userTeamId;
    const ret = this.workspaceService.createWorkspace(body, templateId);

    return ret;
  }

  // 유저가 접근 가능한 Workspace 조회 서비스 기능 테스트 목적 라우트입니다.
  // @Get('/test/user')
  // async getTest(@Session() session: Record<string, any>) {
  //   return await this.workspaceService.getUserOwnWorkspaceList(
  //     session.user.userId,
  //   );
  // }

  // 팀 소유의 Workspace 조회 서비스 기능 테스트 목적 라우트입니다.
  // @Get('/test/team/:teamId')
  // async getTeamWorkspaceForTest(@Param('teamId') teamId: number) {
  //   return await this.workspaceService.getTeamOwnWorkspaceList(teamId);
  // }

  @Get(':workspaceId/info/metadata')
  async getWorkspaceMetadata(@Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto) {
    return await this.workspaceService.getWorkspaceMetadata(workspaceId);
  }

  @Get(':workspaceId/info/team')
  async getWorkspaceOwnerTeam(@Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto) {
    return await this.workspaceService.getWorkspaceOwnerTeam(workspaceId);
  }

  @Get(':workspaceId/info/participant')
  async getWorkspaceParticipantList(@Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto) {
    return await this.workspaceService.getWorkspaceParticipantList(workspaceId);
  }

  @Get(':workspaceId/info')
  async getWorkspaceData(@Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto) {
    return await this.workspaceService.getWorkspaceData(workspaceId);
  }

  @Post(':workspaceId/info/participant')
  async addWorkspaceParticipant(
    @Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto,
    @Body('userId') userId: string,
    @Body('role') role = WORKSPACE_ROLE.VIEWER,
  ) {
    if (!userId) throw new BadRequestException('사용자를 지정해주시기 바랍니다.');
    return await this.workspaceService.addUserIntoWorkspace(userId, workspaceId, role);
  }

  @UseGuards(AuthorizationGuard)
  @Delete(':workspaceId')
  async deleteWorkspace(
    @Session() session: Record<string, any>,
    @Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto,
  ) {
    const userId = session.user.userId;
    if (!(await this.hasProperAuthority(workspaceId, userId, 2))) {
      throw new ForbiddenException('삭제하려는 워크스페이스에 대한 소유자 권한을 갖고 있지 않습니다.');
    }
    await this.workspaceService.deleteWorkspace(workspaceId);
  }

  @UseGuards(AuthorizationGuard)
  @Patch(':workspaceId/info/metadata')
  async updateWorkspaceMetadata(
    @Session() session: Record<string, any>,
    @Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto,
    @Body(new ValidationPipe()) newMetadata: WorkspaceMetadataDto,
  ): Promise<void> {
    const userId = session.user.userId;
    if (!(await this.hasProperAuthority(workspaceId, userId, 2))) {
      throw new ForbiddenException('갱신하려는 워크스페이스에 대한 소유자 권한을 갖고 있지 않습니다.');
    }

    const res = await this.workspaceService.updateWorkspaceMetadata(workspaceId, newMetadata);
    if (!res) {
      throw new BadRequestException('갱신할 수 있는 워크스페이스가 존재하지 않습니다.');
    }
    return;
  }

  @UseGuards(AuthorizationGuard)
  @Patch(':workspaceId/info/participant')
  async updateUserAuthority(
    @Session() session: Record<string, any>,
    @Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto,
    @Body('userId') targetUserId: string,
    @Body('role') role = WORKSPACE_ROLE.VIEWER,
  ) {
    const userId = session.user.userId;
    if (!(await this.hasProperAuthority(workspaceId, userId, 2))) {
      throw new ForbiddenException('워크스페이스에 대한 소유자 권한을 갖고 있지 않아 타인의 권한 변경이 불가능합니다.');
    }
    const res = await this.workspaceService.updateUesrAuthority(workspaceId, targetUserId, role);
    if (!res) throw new BadRequestException('갱신할 수 있는 사용자가 워크스페이스 참여자 중에 존재하지 않습니다.');
    return;
  }

  @Get('/:workspaceId/role/:userId')
  async getWorkspaceAuthority(@Param('workspaceId') workspaceId: string, @Param('userId') userId: string) {
    return await this.workspaceService.getWorkspaceAuthority(workspaceId, userId);
  }

  @Post('/:workspaceId/thumbnail')
  @UseInterceptors(ThumbnailInterceptor)
  async uploadThumbnail(@Param('workspaceId') workspaceId: string, @UploadedFile() file: MulterS3.File) {
    return await this.workspaceService.uploadThumbnail(workspaceId, file);
  }

  @Get('/template')
  async getTemplateList() {
    return await this.workspaceService.getTemplateList();
  }
}
