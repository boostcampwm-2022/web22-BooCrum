import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './strategy/github.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { TeamModule } from 'src/team/team.module';
import { TeamService } from 'src/team/team.service';
import { Team } from 'src/team/entity/team.entity';
import { TeamMember } from 'src/team/entity/team-member.entity';

@Module({
  imports: [UserModule, TeamModule, TypeOrmModule.forFeature([User, Team, TeamMember])],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, UserService, TeamService],
})
export class AuthModule {}
