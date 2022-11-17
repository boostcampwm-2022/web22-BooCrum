/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Req,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  BadRequestException,
  ForbiddenException,
  UseGuards,
  Session,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthorizationGuard } from 'src/auth/guard/session.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // signup 테스트 코드입니다.
  // @Post('/signup')
  // async createUser(@Body() body: UserDto): Promise<UserDto> {
  //   const data = this.userService.createOrFindUser(body);
  //   return data;
  // }

  @Get('/:userId/info')
  async getUserData(@Param('userId') userId: string): Promise<any> {
    return await this.userService.getUserData(userId);
  }

  @Get('/:userId/info/:type')
  async getUserPartialData(
    @Param('userId') userId: string,
    @Param('type') type: string,
  ): Promise<any> {
    switch (type) {
      case 'profile':
        return await this.userService.getUserProfileData(userId);
      case 'team':
        return await this.userService.getUserTeamData(userId);
      case 'workspace':
        return await this.userService.getUserWorkspaceData(userId);
      default:
        throw new BadRequestException(
          `잘못된 유저 데이터 접근입니다. Param: ${type}`,
        );
    }
  }

  @Get('/info')
  @UseGuards(AuthorizationGuard)
  async getMyData(@Session() session: Record<string, any>): Promise<any> {
    return await this.userService.getUserData(session.user.userId);
  }

  @Get('/info/:type')
  @UseGuards(AuthorizationGuard)
  async getMyPartialData(
    @Param('type') type: string,
    @Session() session: Record<string, any>,
  ): Promise<any> {
    const userId = session.user.userId;
    switch (type) {
      case 'profile':
        return await this.userService.getUserProfileData(userId);
      case 'team':
        return await this.userService.getUserTeamData(userId);
      case 'workspace':
        return await this.userService.getUserWorkspaceData(userId);
      default:
        throw new BadRequestException(
          `잘못된 유저 데이터 접근입니다. Param: ${type}`,
        );
    }
  }

  @Patch('/info')
  @UseGuards(AuthorizationGuard)
  async changeUserData(
    @Body() body: UserDto,
    @Session() session: Record<string, any>,
  ): Promise<UserDto> {
    const { userId } = session.user;
    const ret: UserDto = await this.userService.changeUserData(userId, body);
    if (!ret) {
      throw new BadRequestException(
        '잘못되었거나 존재하지 않는 User ID 입니다.',
      );
    }
    return ret;
  }

  @Delete()
  @UseGuards(AuthorizationGuard)
  async deleteUser(
    @Req() req: Request,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const { userId } = session.user;
    const ret = await this.userService.deleteUserData(userId);
    if (!ret)
      throw new ForbiddenException(
        '잘못되었거나 존재하지 않는 User ID 입니다.',
      );
    req.session.destroy(() => {});
  }
}
