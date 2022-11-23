import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/guard/session.guard';
import { TeamDTO } from './dto/team.dto';
import { TeamMember } from './entity/team-member.entity';
import { Team } from './entity/team.entity';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  // Team 생성
  @Post('/')
  @UseGuards(AuthorizationGuard)
  async createTeam(
    @Session() session: Record<string, any>,
    @Body(new ValidationPipe()) teamDTO: TeamDTO,
  ): Promise<Team> {
    teamDTO.userId = session.user.userId;
    return this.teamService.createTeam(teamDTO);
  }

  // Team Member 추가
  @Post('/:teamId/member')
  @UseGuards(AuthorizationGuard)
  async insertTeamMember(
    @Session() session: Record<string, any>,
    @Param('teamId') teamId: number,
    @Body() teamMember: TeamMember,
  ): Promise<boolean> {
    const user = await this.teamService.findTeamMember(teamId, session.user.userId);
    if (!user) throw new BadRequestException(`해당 팀에 대한 권한이 없습니다.`);
    if (user.role < 1) new BadRequestException(`해당 권한이 없습니다.`);
    teamMember.team = await this.teamService.findTeam(teamId);
    return this.teamService.insertTeamMember(teamId, teamMember);
  }

  // Team Member 조회
  @Get('/:teamId/member')
  @UseGuards(AuthorizationGuard)
  async selectTeamMember(@Session() session: Record<string, any>, @Param('teamId') teamId: number): Promise<any> {
    const user = await this.teamService.findTeamMember(teamId, session.user.userId);
    if (!user) throw new BadRequestException(`해당 팀에 대한 권한이 없습니다.`);
    return await this.teamService.selectTeamMember(teamId);
  }

  // Team Workspace 조회
  @Get('/:teamId/workspace')
  @UseGuards(AuthorizationGuard)
  async selectTeamWorkspace(@Session() session: Record<string, any>, @Param('teamId') teamId: number): Promise<any> {
    const user = await this.teamService.findTeamMember(teamId, session.user.userId);
    if (!user) throw new BadRequestException(`해당 팀에 대한 권한이 없습니다.`);
    return await this.teamService.selectTeamWorkspace(teamId);
  }

  // Team 정보 수정
  @Patch('/:teamId')
  @UseGuards(AuthorizationGuard)
  async updateTeam(
    @Session() session: Record<string, any>,
    @Param('teamId') teamId: number,
    @Body() team: Team,
  ): Promise<boolean> {
    const user = await this.teamService.findTeamMember(teamId, session.user.userId);
    if (!user) throw new BadRequestException(`해당 팀에 대한 권한이 없습니다.`);
    if (user.role < 1) new BadRequestException(`해당 권한이 없습니다.`);
    team.teamId = teamId;
    return await this.teamService.updateTeam(team);
  }

  // Team Member 정보 수정
  @Patch('/:teamId/member')
  @UseGuards(AuthorizationGuard)
  async updateTeamMember(
    @Session() session: Record<string, any>,
    @Param('teamId') teamId: number,
    @Body() teamMember: TeamMember,
  ): Promise<boolean> {
    const user = await this.teamService.findTeamMember(teamId, session.user.userId);
    if (!user) throw new BadRequestException(`해당 팀에 대한 권한이 없습니다.`);
    if (user.role < 2) new BadRequestException(`해당 권한이 없습니다.`);
    teamMember.team = await this.teamService.findTeam(teamId);
    return await this.teamService.updateTeamMember(teamId, teamMember);
  }

  // Team Member 삭제
  @Delete('/:teamId/member/:userId')
  @UseGuards(AuthorizationGuard)
  async deleteTeamMember(
    @Session() session: Record<string, any>,
    @Param('teamId') teamId: number,
    @Param('userId') userId: string,
  ): Promise<boolean> {
    const user = await this.teamService.findTeamMember(teamId, session.user.userId);
    if (!user) throw new BadRequestException(`해당 팀에 대한 권한이 없습니다.`);
    if (user.role < 2) new BadRequestException(`해당 권한이 없습니다.`);
    return await this.teamService.deleteTeamMember(teamId, userId);
  }

  // Team 삭제
  @Delete('/:teamId')
  @UseGuards(AuthorizationGuard)
  async delteTeam(@Session() session: Record<string, any>, @Param('teamId') teamId: number): Promise<boolean> {
    const user = await this.teamService.findTeamMember(teamId, session.user.userId);
    if (!user) throw new BadRequestException(`해당 팀에 대한 권한이 없습니다.`);
    if (user.role < 2) new BadRequestException(`해당 권한이 없습니다.`);
    return await this.teamService.deleteTeam(teamId);
  }
}
