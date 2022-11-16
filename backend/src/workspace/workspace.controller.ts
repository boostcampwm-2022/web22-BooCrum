/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Session,
  Param,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  ValidationPipe,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/guard/session.guard';
import { WorkspaceCreateRequestDto } from './dto/workspaceCreateRequest.dto';
import { WorkspaceIdDto } from './dto/workspaceId.dto';
import { Workspace } from './entity/workspace.entity';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

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

  @Get(':workspaceId/participant')
  async getWorkspaceParticipantList(@Param('workspaceId') workspaceId: string) {
    return await this.workspaceService.getWorkspaceParticipantList(workspaceId);
  }

  @Get(':workspaceId')
  async getWorkspaceData(@Param('workspaceId') workspaceId: string) {
    return await this.workspaceService.getWorkspaceData(workspaceId);
  }

  @Post(':workspaceId/participant')
  async addWorkspaceParticipant(
    @Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto,
    @Body('userId') userId: string,
    @Body('role') role = 0,
  ) {
    if (!userId)
      throw new BadRequestException('사용자를 지정해주시기 바랍니다.');
    return await this.workspaceService.addUserIntoWorkspace(
      userId,
      workspaceId,
      role,
    );
  }

  @UseGuards(AuthorizationGuard)
  @Delete(':workspaceId')
  async deleteWorkspace(
    @Session() session: Record<string, any>,
    @Param(new ValidationPipe()) { workspaceId }: WorkspaceIdDto,
  ) {
    const userId = session.user.userId;
    if (
      (await this.workspaceService.getAuthorityOfUser(workspaceId, userId)) < 2
    ) {
      throw new ForbiddenException(
        '삭제하려는 워크스페이스에 대한 소유자 권한을 갖고 있지 않습니다.',
      );
    }
    this.workspaceService.deleteWorkspace(workspaceId);
  }
}
