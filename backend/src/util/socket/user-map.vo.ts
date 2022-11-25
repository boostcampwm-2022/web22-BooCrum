export class UserMapVO {
  constructor(userId: string, nickname: string, workspaceId: string, role: number, color: string) {
    this.userId = userId;
    this.nickname = nickname;
    this.workspaceId = workspaceId;
    this.role = role;
    this.color = color;
  }

  userId: string; // 회원 ID
  nickname: string; // 회원 닉네임
  workspaceId: string; // 워크스페이스 ID
  role: number; // 권한
  color: string; // 커서 색상
}
