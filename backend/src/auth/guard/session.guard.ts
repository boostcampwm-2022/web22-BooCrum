import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * 로그인한 사용자만 통과시키는 가드입니다.
 * 가드의 기준은 "Session에 user 데이터가 존재하는가?" 입니다.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateRequest(req);
  }

  private validateRequest(req: any) {
    const session: Record<string, any> = req.session;
    if (!session.user) throw new UnauthorizedException('비로그인 상태입니다.');
    return true;
  }
}

/**
 * 로그인하지 않은 사용자만 통과시키는 가드입니다.
 * 가드의 기준은 "Session에 user 데이터가 존재하는가?" 입니다.
 * 중복 로그인을 방지하기 위한 장치입니다.
 */
@Injectable()
export class UnAuthorizationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateRequest(req);
  }

  private validateRequest(req: any) {
    const session: Record<string, any> = req.session;
    if (session.user) throw new BadRequestException('이미 로그인 중입니다.');
    return true;
  }
}
