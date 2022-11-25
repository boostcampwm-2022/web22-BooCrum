import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { DataSource } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { createSessionMiddleware } from '../middlewares/session.middleware';
import { Request, Response, NextFunction } from 'express';
import { ObjectHandlerService } from 'src/object-database/object-handler.service';
import { UserMapVO } from '../util/socket/user-map.vo';
import { ObjectDTO } from '../util/socket/object.dto';
import { UserDAO } from '../util/socket/user.dao';
import { DbAccessService } from './db-access.service';

//============================================================================================//
//==================================== Socket.io 서버 정의 ====================================//
//============================================================================================//

function fitFormatToUserDAO(userId: string, nickname: string) {
  return new UserDAO(userId, nickname);
}

@WebSocketGateway(8080, { cors: '*', namespace: /workspace\/.+/ })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');
  private userMap = new Map<string, UserMapVO>();

  constructor(
    private objectHandlerService: ObjectHandlerService,
    private dbAccessService: DbAccessService,
    private dataSource: DataSource,
  ) {}

  // Socket Server가 실행된 직후 실행할 것들. (즉, server가 초기화된 직후.)
  async afterInit() {
    // REST API 서버에서 사용하는 세션 정보를 express-session을 이용하여 가져옴.
    const sessionMiddleware = createSessionMiddleware();
    this.server.use((socket, next) =>
      sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction),
    );
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // 1. 워크스페이스 조회
    const workspaceId = client.nsp.name.match(/workspace\/(.+)/)[1];
    const isValidWorkspace = await this.dbAccessService.isWorkspaceExist(workspaceId, queryRunner);
    if (!isValidWorkspace) {
      this.logger.error(`존재하지 않는 Workspace 접근`);
      client.disconnect();
      return;
    }

    // 2. 쿠키 존재 여부 조회 및 userId 설정 : 회원(userId 사용), 비회원(소켓 ID 사용)
    const session = client.request.session;
    const userData =
      session.user !== undefined
        ? fitFormatToUserDAO(session.user.userId, session.user.nickname)
        : fitFormatToUserDAO('Guest', `Guest(${client.id})`);

    // 3. WorkspaceMember 존재 여부 조회 후 role 부여
    const role = await this.dbAccessService.getUserRoleAt(userData.userId, workspaceId, queryRunner);
    // 4. Random 색상 지정
    const color = `#${Math.round(Math.random() * 0xffffff).toString(16)}`;

    // 5. room 추가
    //! Dynamic Namespace를 사용함으로써, 네임스페이스가 자동으로 워크스페이스 각각을 의미하게 됨.
    //! 그러한 이유로 workspaceId에 대한 room 추가가 무의미해짐.
    // client.join(workspaceId);
    if (session.user !== undefined) client.join(userData.userId);

    // 6. userMap 추가
    // 중복 유저가 존재한다면 그건 어떻게 처리할 것인가? (소켓이 여러개 인거지, 사람이 여러 명인건 아님.)
    this.userMap.set(client.id, new UserMapVO(userData.userId, userData.nickname, workspaceId, role, color));

    // 7. Socket.io - Client 이벤트 호출
    // TODO: 전체 순환을 써도 되는가? 이건 workspaceId -> VO로 연결하는 것이 낫지 않냐?
    const members = Array.from(this.userMap.values())
      .filter((vo) => vo.workspaceId === workspaceId)
      .map((vo) => new UserDAO(vo.userId, vo.nickname));
    const objects = await this.objectHandlerService.selectAllObjects(workspaceId);

    //? 자신 포함이야... 자신 제외하고 보내야 하는거야...?
    client.emit('init', { members, objects });
    client.nsp.emit('enter_user', userData);

    await queryRunner.release();
  }

  // Disconnect 이벤트가 발생하였을 때 수행할 처리를 기록한다.
  handleDisconnect(client: Socket) {
    const clientId = client.id;
    this.logger.log(`Client disconnected: ${clientId}`);
    if (this.userMap.get(clientId)) {
      const userId = this.userMap.get(clientId).userId;
      this.userMap.delete(clientId);
      client.nsp.emit('leave_user', userId);
    }
  }

  @SubscribeMessage('move_pointer')
  async moveMousePointer(@MessageBody() { x, y }, @ConnectedSocket() socket: Socket) {
    const userId = this.userMap.get(socket.id)?.userId;
    if (!userId) return;
    //TODO: 게스트 마우스 포인터가 보일 필요가 있음?
    socket.nsp.emit('move_pointer', { x, y, userId });
  }

  @SubscribeMessage('select_object')
  async selectObject(@MessageBody('objectId') objectId: string, @ConnectedSocket() socket: Socket) {
    const userId = this.userMap.get(socket.id)?.userId;
    if (!userId) return;
    socket.nsp.emit('select_object', { objectId, userId });
  }

  @SubscribeMessage('unselect_object')
  async unselectObject(@MessageBody('objectId') objectId: string, @ConnectedSocket() socket: Socket) {
    const userId = this.userMap.get(socket.id)?.userId;
    if (!userId) return;
    socket.nsp.emit('unselect_object', { objectId, userId });
  }

  @SubscribeMessage('create_object')
  async createObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    if (!objectData.text) objectData.text = '';
    objectData.creator = socket.request.session.user.userId;
    const ret = await this.objectHandlerService.createObject(workspaceId, objectData);
    if (!ret) throw new WsException('생성 실패');
    socket.nsp.emit('create_object', objectData);
  }

  @SubscribeMessage('update_object')
  async updateObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    const ret = await this.objectHandlerService.updateObject(workspaceId, objectData);
    if (!ret) throw new WsException('수정 실패');
    socket.nsp.emit('update_object', objectData);
  }

  @SubscribeMessage('delete_object')
  async deleteObject(@MessageBody('objectId') objectId: string, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    const ret = await this.objectHandlerService.deleteObject(workspaceId, objectId);
    if (!ret) new WsException('삭제 실패');
    socket.nsp.emit('delete_object', { objectId });
  }
}
