export class UserMapVO {
  // constructor(socketId: string, userId: string, workspaceId: string, role: number, color: string) {
  constructor(userId: string, workspaceId: string, role: number, color: string) {
    // this.socketId = socketId;
    this.userId = userId;
    this.workspaceId = workspaceId;
    this.role = role;
    this.color = color;
  }

  // socketId: string;
  userId: string;
  workspaceId: string;
  role: number;
  color: string; // 커서 색상
}
