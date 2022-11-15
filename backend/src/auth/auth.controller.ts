/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  UseGuards,
  Get,
  Put,
  Req,
  Session,
  Redirect,
} from '@nestjs/common';
import { Request } from 'express';
import { GithubOAuthGuard } from './guard/github.guard';
import {
  AuthorizationGuard,
  UnAuthorizationGuard,
} from './guard/session.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(GithubOAuthGuard)
  @UseGuards(UnAuthorizationGuard)
  @Get('/oauth/github')
  startGithubOAuthProcess(@Req() req: Request) {}

  @UseGuards(GithubOAuthGuard)
  @UseGuards(UnAuthorizationGuard)
  @Get('/oauth/github_callback')
  @Redirect('/')
  handleGithubData(
    @Req() req: Request,
    @Session() session: Record<string, any>,
  ): void {
    session.user = req.user;
  }

  @UseGuards(AuthorizationGuard)
  @Put('/logout')
  destroySession(@Req() req: Request): void {
    req.session.destroy(() => {});
  }
}
