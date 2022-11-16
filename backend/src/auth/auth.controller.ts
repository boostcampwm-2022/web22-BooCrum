/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  UseGuards,
  Get,
  Put,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
  startGithubOAuthProcess() {}

  @UseGuards(GithubOAuthGuard)
  @UseGuards(UnAuthorizationGuard)
  @Get('/oauth/github_callback')
  handleGithubData(
    @Req() req: Request,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ): void {
    session.user = req.user;
    res.redirect(process.env.REDIRECT_AFTER_LOGIN);
  }

  @UseGuards(AuthorizationGuard)
  @Put('/logout')
  destroySession(@Req() req: Request): void {
    req.session.destroy(() => {});
  }
}
