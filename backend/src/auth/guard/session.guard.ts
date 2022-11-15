import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

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
