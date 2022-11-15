import {
  Controller,
  Body,
  Get,
  Param,
  Patch,
  BadRequestException,
  UseGuards,
  Session,
} from '@nestjs/common';
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

  @Get('/info/:userId')
  async getUserData(@Param('userId') userId: string): Promise<any> {
    return await this.userService.getUserData(userId);
  }

  @Get('/info')
  @UseGuards(AuthorizationGuard)
  async getMyData(@Session() session: Record<string, any>): Promise<any> {
    return await this.userService.getUserData(session.user.userId);
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
}
