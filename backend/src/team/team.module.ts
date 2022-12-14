import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entity/team.entity';
import { TeamMember } from './entity/team-member.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember]), UserModule],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
