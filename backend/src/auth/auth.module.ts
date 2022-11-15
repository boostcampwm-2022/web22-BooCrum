import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './strategy/github.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { TeamMember } from 'src/team/entity/team-member.entity';
import { WorkspaceMember } from 'src/workspace/entity/workspace-member.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, TeamMember, WorkspaceMember]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy, UserService],
})
export class AuthModule {}
