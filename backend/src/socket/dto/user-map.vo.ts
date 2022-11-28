export class UserMapVO {
  constructor(userId: string, nickname: string, workspaceId: string, role: number, color: string, isGuest = true) {
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
  role: number; // 권한
  color: string; // 커서 색상
  isGuest: boolean; // 게스트인지, 유저인지 확인.
}
