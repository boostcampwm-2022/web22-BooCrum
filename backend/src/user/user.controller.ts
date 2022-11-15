import { Controller, Body, Post, Get, Query } from '@nestjs/common';
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

  @Get('/data')
  async getUserData(@Query('userId') userId: string): Promise<any> {
    return await this.userService.getUserData(userId);
  }
}
