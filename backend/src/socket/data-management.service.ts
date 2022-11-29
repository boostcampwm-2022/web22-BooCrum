import { Injectable, Logger } from '@nestjs/common';
import { UserMapVO } from './dto/user-map.vo';
import { Socket } from 'socket.io';
import { DbAccessService } from './db-access.service';

@Injectable()
export class DataManagementService {
  private socketUserDataMap = new Map<string, UserMapVO>(); // socketId -> userMapVO
  private workspaceUserDataMap = new Map<string, UserMapVO[]>(); // workspaceId -> userMapVO[]
  private logger: Logger = new Logger('UserDataService');

  constructor(private dbAccessService: DbAccessService) {}

  /**
   * 소켓과 워크스페이스 ID를 이용하여 UserMapVO로 포맷팅한다.
   * @param client 현재 연결된 Socket
   * @param workspaceId 해당 소켓과 연관된 Workspace ID
   * @returns UserMapVO로 포맷팅한 객체
   */
  private async formatDataToUserMapVO(client: Socket, workspaceId: string): Promise<UserMapVO> {
    const sessionUserData = client.request.session.user;

    try {
      const userId = sessionUserData?.userId ?? `Guest(${client.id})`;
      const nickname = sessionUserData?.nickname ?? `Guest(${client.id})`;
      const role = !sessionUserData ? 0 : await this.dbAccessService.getOrCreateUserRoleAt(userId, workspaceId, 1); // 지금은 테스트 목적으로 초기권한 1로 잡음.
      const color = `#${Math.round(Math.random() * 0xffffff).toString(16)}`;

      return new UserMapVO(userId, nickname, workspaceId, role, color, !sessionUserData);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  /**
   * 특정 워크스페이스에 접속한 유저 정보를 User ID를 이용하여 탐색한다.
   * @param userId 특정 유저의 ID
   * @param workspaceId 탐색하고자 하는 Workspace의 ID
   * @returns 현재 접속 중인 User일 경우 UserMapVO 객체를 전달한다. 아닐 경우 null을 전달한다.
   */
  findUserDataInWorkspaceByUserId(userId: string, workspaceId: string): UserMapVO {
    if (!userId || !this.workspaceUserDataMap.has(workspaceId)) return null;
    return (
      this.workspaceUserDataMap
        .get(workspaceId)
        .filter((vo) => vo.userId === userId)
        .at(0) ?? null
    );
  }

  /**
   * 특정 소켓과 연결된 유저 정보를 탐색한다.
   * @param socketId 탐색하길 원하는 Socket의 ID
   * @returns 연결된 데이터 혹은 비연결 시 null
   */
  findUserDataBySocketId(socketId: string): UserMapVO {
    if (!socketId || !this.socketUserDataMap.has(socketId)) return null;
    return this.socketUserDataMap.get(socketId);
  }

  /**
   * 특정 워크스페이스에 연결 중인 모든 유저 정보를 탐색한다.
   * @param workspaceId 탐색하길 원하는 워크스페이스의 ID
   * @returns 해당 워크스페이스에 접속 중인 유저들의 정보, 없을 경우 null
   */
  findUserDataListInWorkspace(workspaceId: string): UserMapVO[] {
    if (!workspaceId || !this.workspaceUserDataMap.has(workspaceId)) return null;
    return this.workspaceUserDataMap.get(workspaceId);
  }

  /**
   * 특정 워크스페이스에 유저 정보를 등록하거나, 기존의 유저 정보를 새로운 소켓과 연결합니다.
   * @param client 유저 정보를 연결할 소켓 객체
   * @param workspaceId 유저 정보를 추가하거나 탐색할 워크스페이스의 ID
   * @returns 탐색하였거나 추가한 유저 정보
   */
  async findOrAddUserData(client: Socket, workspaceId: string): Promise<UserMapVO> {
    const userId = client.request.session.user?.userId;
    // 이미 워크스페이스에 참여 중인 User인 경우 Socket만 갱신한다.
    let userData = this.findUserDataInWorkspaceByUserId(userId, workspaceId);
    if (userData) {
      userData.count++;
      this.socketUserDataMap.set(client.id, userData);
      return userData;
    }

    // Workspace에 새로 들어온 경우 정보를 생성한다.
    userData = await this.formatDataToUserMapVO(client, workspaceId);
    if (!userData) throw new Error('유저 정보 초기화 실패');
    userData.count++;

    this.socketUserDataMap.set(client.id, userData);
    if (!this.workspaceUserDataMap.has(workspaceId)) this.workspaceUserDataMap.set(workspaceId, [userData]);
    else this.workspaceUserDataMap.get(workspaceId).push(userData);
    return userData;
  }

  /**
   * 특정 워크스페이스에 있는 유저 정보를 제거하거나, 소켓과 유저 정보의 연결을 제거합니다.
   *
   * 만약 유저 정보가 존재하지 않을 경우 오류를 발생시킵니다.
   * @param client 유저 정보와의 연결을 제거할 소켓
   * @param workspaceId 유저 정보를 담고 있는 워크스페이스의 ID
   */
  deleteUserData(client: Socket): UserMapVO {
    const socketId = client.id;
    const userData = this.socketUserDataMap.get(socketId);
    if (!userData) return null;
    userData.count--;
    this.socketUserDataMap.delete(socketId);

    // 만약 해당 유저가 더이상 워크스페이스를 보지 않을 경우, Workspace 유저 목록에서 제외한다.
    // 만약 워크스페이스를 아무도 보지 않을 경우, 워크스페이스를 관리 목록에서 제거한다.
    if (userData.count < 1) {
      let workspaceUserList = this.findUserDataListInWorkspace(userData.workspaceId);
      workspaceUserList = workspaceUserList.filter((vo) => vo !== userData);

      // 해당 워크스페이스에 더이상 온라인 사용자가 없을 경우 workspace 자체를 관리 목록에서 제거한다.
      // 아닐 경우 유저 VO만 제거한다.
      if (workspaceUserList.length === 0) this.workspaceUserDataMap.delete(userData.workspaceId);
      else this.workspaceUserDataMap.set(userData.workspaceId, workspaceUserList);
    }
    return userData;
  }
}
