import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './auth.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy],
})
export class AuthModule {}
