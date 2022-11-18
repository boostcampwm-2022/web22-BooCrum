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
  UseGuards,
  ValidationPipe,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/guard/session.guard';
import { WorkspaceCreateRequestDto } from './dto/workspaceCreateRequest.dto';
import { WorkspaceIdDto } from './dto/workspaceId.dto';
import { WorkspaceMetadataDto } from './dto/workspaceMetadata.dto';
import { Workspace } from './entity/workspace.entity';
import { WorkspaceService } from './workspace.service';

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
    @Session() session: Record<string, any>,
  ): Promise<Workspace> {
    body.ownerId = session.user.userId;
    return this.workspaceService.createWorkspace(body);
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
    @Body('role') role = 0,
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
    this.workspaceService.deleteWorkspace(workspaceId);
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
    @Body('role') role = 0,
  ) {
    const userId = session.user.userId;
    if (!(await this.hasProperAuthority(workspaceId, userId, 2))) {
      throw new ForbiddenException('워크스페이스에 대한 소유자 권한을 갖고 있지 않아 타인의 권한 변경이 불가능합니다.');
    }
    const res = await this.workspaceService.updateUesrAuthority(workspaceId, targetUserId, role);
    if (!res) throw new BadRequestException('갱신할 수 있는 사용자가 워크스페이스 참여자 중에 존재하지 않습니다.');
    return;
  }
}
