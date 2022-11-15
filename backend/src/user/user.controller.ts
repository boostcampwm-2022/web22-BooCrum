import {
  Controller,
  Body,
  Get,
  Query,
  Patch,
  BadRequestException,
} from '@nestjs/common';
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

  @Get('/info')
  async getUserData(@Query('userId') userId: string): Promise<any> {
    return await this.userService.getUserData(userId);
  }

  @Patch('/info')
  async changeUserData(
    @Query('userId') userId: string,
    @Body() body: UserDto,
  ): Promise<UserDto> {
    const ret: UserDto = await this.userService.changeUserData(userId, body);
    if (!ret) {
      throw new BadRequestException(
        '잘못되었거나 존재하지 않는 User ID 입니다.',
      );
    }
    return ret;
  }
}
