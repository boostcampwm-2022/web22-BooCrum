import { CanActivate, ExecutionContext, Inject, mixin } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';
import { UserManagementService } from '../user-management.service';

export const UserRoleGuard = (minimumRole: WORKSPACE_ROLE) => {
  class UserRoleGuardMixin implements CanActivate {
    constructor(@Inject(UserManagementService) readonly userManagementService: UserManagementService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const client = context.switchToWs().getClient<Socket>();
      const userData = this.userManagementService.findUserDataBySocketId(client.id);
      if (userData.role < minimumRole) throw new WsException('유효하지 않은 권한입니다.');
      return userData.role >= minimumRole;
    }
  }

  const guard = mixin(UserRoleGuardMixin);
  return guard;
};
