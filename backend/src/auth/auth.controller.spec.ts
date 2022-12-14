import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from '../team/entity/team-member.entity';
import { Team } from '../team/entity/team.entity';
import { User } from '../user/entity/user.entity';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TeamModule } from '../team/team.module';
import { UserService } from '../user/user.service';
import { TeamService } from '../team/team.service';
import { join } from 'path';
import { GithubStrategy } from './strategy/github.strategy';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT),
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
          migrations: [
            process.env.NODE_ENV !== 'develop' && process.env.NODE_ENV !== 'production'
              ? 'src/migrations/**/*.ts'
              : 'dist/migrations/**/*.js',
          ],
        }),
        TypeOrmModule.forFeature([User, Team, TeamMember]),
        UserModule,
        TeamModule,
      ],
      controllers: [AuthController],
      providers: [GithubStrategy, UserService, TeamService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  test('AuthController - Defined', async () => {
    expect(controller).toBeDefined();
  });

  test('AuthController - startGithubOAuthProcess', () => {
    expect(controller.startGithubOAuthProcess).toBeDefined();
  });

  test('AuthController - handleGithubData', () => {
    expect(controller.handleGithubData).toBeDefined();
  });

  test('AuthController - destroySession', () => {
    expect(controller.destroySession).toBeDefined();
  });

  test('AuthController - checkLoginStatus', () => {
    expect(controller.checkLoginStatus).toBeDefined();
  });
});
