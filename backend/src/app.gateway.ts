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
import { Server, Socket } from 'socket.io';
import { createSessionMiddleware } from './middlewares/session.middleware';
import { Request, Response, NextFunction } from 'express';
import { UserMapVO } from './util/socket/user-map.vo';
import { ObjectDTO } from './util/socket/object.dto';
import { UserDAO } from './util/socket/user.dao';
import { AppService } from './app.service';

//============================================================================================//
//==================================== Socket.io 서버 정의 ====================================//
//============================================================================================//

@WebSocketGateway(8080, { cors: '*', namespace: /workspace\/.+/ })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private userMap = new Map<string, UserMapVO>();

  constructor(private readonly appService: AppService) {}

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

    // 1. 워크스페이스 조회
    const workspaceId = client.nsp.name.match(/workspace\/(.+)/)[1];
    const isValidWorkspace = await this.appService.isExistWorkspace(workspaceId);
    if (!isValidWorkspace) {
      this.logger.error(`존재하지 않는 Workspace 접근`);
      client.disconnect();
      return;
    }

    // 2. 쿠키 존재 여부 조회 및 userId 설정 : 회원(userId 사용), 비회원(소켓 ID 사용)
    const session = client.request.session;
    let userId: string;
    let nickname: string;
    if (session.user !== undefined) {
      userId = session.user.userId;
      nickname = session.user.nickname;
      client.join(userId);
    } else {
      userId = 'Guest';
      nickname = `Guest(${client.id})`;
    }

    // 3. WorkspaceMember 존재 여부 조회 후 role 부여
    const role = await this.appService.getUserRole(workspaceId, userId);

    // 4. Random 색상 지정
    const color = `#${Math.round(Math.random() * 0xffffff).toString(16)}`;

    // 5. room 추가
    client.join(workspaceId);

    // 6. userMap 추가
    this.userMap.set(client.id, new UserMapVO(userId, nickname, workspaceId, role, color));

    // 7. Socket.io - Client 이벤트 호출
    const members = Array.from(this.userMap.values())
      .filter((vo) => vo.workspaceId === workspaceId)
      .map((vo) => vo.userId);
    const objects = await this.appService.getAllObjects(workspaceId);

    client.emit('init', { members, objects });
    const userData = new UserDAO(userId, nickname);
    this.server.to(workspaceId).emit('enter_user', userData);
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;

    if (this.userMap.get(clientId)) {
      this.logger.log(`Client disconnected: ${clientId}`);

      const workspaceId = this.userMap.get(clientId).workspaceId;
      const userId = this.userMap.get(clientId).userId;
      this.userMap.delete(clientId);
      this.server.to(workspaceId).emit('leave_user', userId);
    }
  }

  @SubscribeMessage('move_pointer')
  async moveMousePointer(@MessageBody() { x, y }, @ConnectedSocket() socket: Socket) {
    const userId = this.userMap.get(socket.id).userId;
    this.server.to(this.userMap.get(socket.id).workspaceId).emit('move_pointer', { x, y, userId });
  }

  @SubscribeMessage('select_object')
  async selectObject(@MessageBody() objectId: string, @ConnectedSocket() socket: Socket) {
    this.server.to(this.userMap.get(socket.id).workspaceId).emit('select_object', objectId);
  }

  @SubscribeMessage('unselect_object')
  async unselectObject(@MessageBody() objectId: string, @ConnectedSocket() socket: Socket) {
    this.server.to(this.userMap.get(socket.id).workspaceId).emit('unselect_object', objectId);
  }

  @SubscribeMessage('create_object')
  async createObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    const requestURL = `${process.env.API_ADDRESS}/object-database/${workspaceId}/object`;
    const ret = await this.appService.requestAPI(requestURL, 'POST', objectData);
    if (ret) this.server.to(workspaceId).emit('create_object', objectData);
    else throw new WsException('생성 실패');
  }

  @SubscribeMessage('update_object')
  async updateObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    const requestURL = `${process.env.API_ADDRESS}/object-database/${workspaceId}/object/${objectData.objectId}`;
    const ret = await this.appService.requestAPI(requestURL, 'PATCH', objectData);
    if (ret) this.server.to(this.userMap.get(socket.id).workspaceId).emit('update_object', objectData);
    else throw new WsException('수정 실패');
  }

  @SubscribeMessage('delete_object')
  async deleteObject(@MessageBody() objectId: string, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    const requestURL = `${process.env.API_ADDRESS}/object-database/${workspaceId}/object/${objectId}`;
    const ret = await this.appService.requestAPI(requestURL, 'DELETE');
    if (ret) this.server.to(this.userMap.get(socket.id).workspaceId).emit('delete_object', objectId);
    else throw new WsException('삭제 실패');
  }
}
