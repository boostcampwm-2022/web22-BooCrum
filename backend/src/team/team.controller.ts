import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { TeamDTO } from './dto/team.dto';
import { TeamMember } from './entity/team-member.entity';
import { Team } from './entity/team.entity';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  // Team 생성
  @Post('/')
  async createTeam(@Body() teamDTO: TeamDTO): Promise<any> {
    return this.teamService.createTeam(teamDTO);
  }

  // Team Member 조회
  @Get('/member/:teamId')
  async selectTeamMember(@Param('teamId') teamId: number): Promise<any> {
    return await this.teamService.selectTeamMember(teamId);
  }

  // Team Workspace 조회
  @Get('/team-workspace/:teamId')
  async selectTeamWorkspace(@Param('teamId') teamId: number): Promise<any> {
    return await this.teamService.selectTeamWorkspace(teamId);
  }

  // Team 정보 수정
  @Patch('/')
  async updateTeam(@Body() team: Team): Promise<any> {
    return await this.teamService.updateTeam(team);
  }

  // Team Member 정보 수정
  @Patch('/member')
  async updateTeamMember(@Body() teamMember: TeamMember): Promise<any> {
    return await this.teamService.updateTeamMember(teamMember);
  }

  // Team Member 삭제
  @Delete('/:teamId/member/:userId')
  async deleteTeamMember(@Param('teamId') teamId: number, @Param('userId') userId: string) {
    return await this.teamService.deleteTeamMember(teamId, userId);
  }

  // Team 삭제
  @Delete('/:teamId')
  async delteTeam(@Param('teamId') teamId: number) {
    return await this.teamService.deleteTeam(teamId);
  }
}
