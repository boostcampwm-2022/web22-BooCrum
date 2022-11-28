import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';

export class UserMapVO {
  constructor(
    userId: string,
    nickname: string,
    workspaceId: string,
    role: WORKSPACE_ROLE | number,
    color: string,
    isGuest = true,
  ) {
    this.userId = userId;
    this.nickname = nickname;
    this.workspaceId = workspaceId;
    this.role = role;
    this.color = color;
    this.isGuest = isGuest;
  }

  userId: string; // 회원 ID
  nickname: string; // 회원 닉네임
  workspaceId: string; // 워크스페이스 ID
  role: WORKSPACE_ROLE | number; // 권한
  color: string; // 커서 색상
  isGuest: boolean; // 게스트인지, 유저인지 확인.
}
