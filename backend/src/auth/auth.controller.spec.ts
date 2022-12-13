import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from '../team/entity/team-member.entity';
import { Team } from '../team/entity/team.entity';
import { TeamModule } from '../team/team.module';
import { TeamService } from '../team/team.service';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './strategy/github.strategy';
import { config } from '../ormconfig';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        TeamModule,
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([User, Team, TeamMember]),
      ],
      controllers: [AuthController],
      providers: [GithubStrategy, UserService, TeamService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  test('AuthController defined test', async () => {
    expect(AuthController).toBeDefined();
  });
});
