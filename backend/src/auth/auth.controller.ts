/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { GithubOAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('/oauth/github')
  @UseGuards(GithubOAuthGuard)
  startGithubOAuthProcess(@Req() req: Request) {}

  @Get('/oauth/github_callback')
  @UseGuards(GithubOAuthGuard)
  handleGithubData(@Req() req: Request): void {
    const { user, session } = req;
    console.log(user, session);
  }
}
