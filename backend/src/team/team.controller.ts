import { Body, Controller, Post } from '@nestjs/common';
import { TeamDTO } from './dto/team.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post('/')
  async createTeam(@Body() teamDTO: TeamDTO): Promise<any> {
    return this.teamService.createTeam(teamDTO);
  }
}
