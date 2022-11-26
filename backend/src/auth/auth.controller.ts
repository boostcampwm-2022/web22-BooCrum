/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, UseGuards, UseFilters, Get, Put, Req, Res, Session, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UnAuthRedirectionFilter } from './filter/unauth-redirect.filter';
import { GithubOAuthGuard } from './guard/github.guard';
import { AuthorizationGuard, UnAuthorizationGuard } from './guard/session.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(GithubOAuthGuard)
  @UseGuards(UnAuthorizationGuard)
  @UseFilters(UnAuthRedirectionFilter)
  @Get('/oauth/github')
  startGithubOAuthProcess() {}

  @UseGuards(GithubOAuthGuard)
  @UseGuards(UnAuthorizationGuard)
  @UseFilters(UnAuthRedirectionFilter)
  @Get('/oauth/github_callback')
  handleGithubData(@Req() req: Request, @Session() session: Record<string, any>, @Res() res: Response): void {
    session.user = req.user;
    res.redirect(process.env.REDIRECT_AFTER_LOGIN);
  }

  @UseGuards(AuthorizationGuard)
  @Put('/logout')
  destroySession(@Req() req: Request): void {
    req.session.destroy(() => {});
  }

  @Get('/status')
  checkLoginStatus(@Session() session: Record<string, any>, @Res() res: Response): void {
    console.log(session.user);
    if (!session.user) throw new UnauthorizedException();
    res.sendStatus(200);
  }

  // @Get('/info/:sessionId')
  // async getSessionData(@Param('sessionId') sessionId: string) {
  //   const { data } = (await this.authService.getSessionData(sessionId))[0];
  //   const { user } = JSON.parse(data);
  //   return user.userId;
  // }
}
