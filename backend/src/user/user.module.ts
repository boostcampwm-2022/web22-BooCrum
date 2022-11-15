import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { TeamMember } from 'src/team/entity/team-member.entity';
import { WorkspaceMember } from 'src/workspace/entity/workspace-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TeamMember, WorkspaceMember])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
