import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './strategy/github.strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { TeamModule } from '../team/team.module';
import { TeamService } from '../team/team.service';
import { Team } from '../team/entity/team.entity';
import { TeamMember } from '../team/entity/team-member.entity';

@Module({
  imports: [UserModule, TeamModule, TypeOrmModule.forFeature([User, Team, TeamMember])],
  controllers: [AuthController],
  providers: [GithubStrategy, UserService, TeamService],
})
export class AuthModule {}
