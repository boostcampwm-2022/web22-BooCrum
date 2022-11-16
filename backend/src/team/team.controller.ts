import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { TeamDTO } from './dto/team.dto';
import { Team } from './entity/team.entity';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post('/create')
  async createTeam(@Body() teamDTO: TeamDTO): Promise<any> {
    return this.teamService.createTeam(teamDTO);
  }

  @Post('/team-member')
  async selectTeamMember(@Body() team: Team): Promise<any> {
    return await this.teamService.selectTeamMember(team);
  }

  @Get('/team-workspace/:teamId')
  async selectTeamWorkspace(@Param('teamId') teamId: number) {
    return await this.teamService.selectTeamWorkspace(teamId);
  }

  @Patch('/team-update')
  async updateTeam(@Body() team: Team): Promise<any> {
    return await this.teamService.updateTeam(team);
  }

  @Delete('/team-member/:teamId/:userId')
  async deleteTeamMember(@Param('teamId') teamId: number, @Param('userId') userId: string) {
    return await this.teamService.deleteTeamMember(teamId, userId);
  }

  @Delete('/:teamId')
  async delteTeam(@Param('teamId') teamId: number) {
    return await this.teamService.deleteTeam(teamId);
  }
}
