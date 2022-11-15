import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { TeamMember } from 'src/team/entity/team-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TeamMember])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
