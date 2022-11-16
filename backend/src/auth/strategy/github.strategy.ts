import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, Profile } from 'passport-github';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private userService: UserService) {
    const options: StrategyOptions = {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
    super(options);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const userData: UserDto = {
      userId: profile.id,
      nickname: profile.username,
    };
    const user = this.userService.createOrFindUser(userData);
    return user; // req.user에 담기는 정보
  }
}
