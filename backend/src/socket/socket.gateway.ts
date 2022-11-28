import { Logger, ValidationPipe } from '@nestjs/common';
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
import { createSessionMiddleware } from '../middlewares/session.middleware';
import { Request, Response, NextFunction } from 'express';
import { ObjectHandlerService } from 'src/object-database/object-handler.service';
import { UserMapVO } from '../util/socket/user-map.vo';
import { ObjectDTO } from '../util/socket/object.dto';
import { UserDAO } from '../util/socket/user.dao';
import { DbAccessService } from './db-access.service';
import { DataManagementService } from './data-management.service';
import { WorkspaceObject } from '../object-database/entity/workspace-object.entity';

//============================================================================================//
//==================================== Socket.io 서버 정의 ====================================//
//============================================================================================//

@WebSocketGateway(8080, { cors: '*', namespace: /workspace\/.+/ })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');

  constructor(
    private objectHandlerService: ObjectHandlerService,
    private dbAccessService: DbAccessService,
    private dataManagementService: DataManagementService,
  ) {}

  /**
   * 소켓 서버 초기화 직후 실행할 처리를 정의한다.
   *
   * 처리 과정:
   * 1. Express-session을 Socket 서버와 연결한다.
   */
  async afterInit() {
    // REST API 서버에서 사용하는 세션 정보를 express-session을 이용하여 가져옴.
    const sessionMiddleware = createSessionMiddleware();
    this.server.use((socket, next) =>
      sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction),
    );
  }

  /**
   * 소켓 연결 직후 처리를 정의한다.
   *
   * - 아웃바운드 이벤트: init(타겟 소켓) / enter_user(네임스페이스 단위)
   *
   * @param client 현재 연결된(connect 이벤트를 발생시킨) 소켓
   * @param args 같이 넘어온 인자
   */
  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    // 1. 워크스페이스 조회
    const workspaceId = client.nsp.name.match(/workspace\/(.+)/)[1];
    if (!(await this.dbAccessService.isWorkspaceExist(workspaceId))) {
      this.logger.error(`존재하지 않는 Workspace 접근`);
      client.emit('exception', { message: `존재하지 않는 Workspace 접근` });
      client.disconnect();
      return;
    }

    // 2. 데이터 가공 수행
    const userMapVO: UserMapVO = await this.dataManagementService.findOrAddUserData(client, workspaceId);
    if (!userMapVO) {
      client.emit('exception', { status: 'error', message: 'User Data 초기화 중 Role 획득 실패' });
      return client.disconnect();
    }

    // 3. 로그인 유저 userId room에 추가
    //! Dynamic Namespace를 사용함으로써, 네임스페이스가 자동으로 워크스페이스 각각을 의미하게 됨.
    //! 그러한 이유로 workspaceId에 대한 room 추가가 무의미해짐.
    if (!userMapVO.isGuest) client.join(userMapVO.userId);

    // 4. Init 목적 데이터 가공
    const members: UserDAO[] = this.dataManagementService
      .findUserDataListInWorkspace(workspaceId)
      .map((vo) => new UserDAO(vo.userId, vo.nickname, vo.color, vo.role));
    const objects: WorkspaceObject[] = await this.objectHandlerService.selectAllObjects(workspaceId);
    const userData = new UserDAO(userMapVO.userId, userMapVO.nickname, userMapVO.color, userMapVO.role);

    // 5. Socket 이벤트 Emit
    client.emit('init', { members, objects, userData });
    client.nsp.emit('enter_user', userData);
  }

  /**
   * Disconnect 이벤트가 발생하였을 때 수행할 처리를 기록한다.
   *
   * - **발생 조건**: 클라이언트 측에서 창을 끄거나, disconnect를 실행할 경우.
   *
   * - **server to client**: 'leave_user'
   * @param client 연결을 끊기 직전인(disconnect 이벤트를 발생시킨) 소켓
   */
  handleDisconnect(client: Socket) {
    const clientId = client.id;
    this.logger.log(`Client disconnected: ${clientId}`);
    try {
      const userData = this.dataManagementService.deleteUserData(client);
      if (userData) client.nsp.emit('leave_user', { userId: userData.userId });
    } catch (e) {
      this.logger.error(e);
      throw new WsException(e.message);
    }
  }

  @SubscribeMessage('move_pointer')
  async moveMousePointer(@MessageBody() { x, y }, @ConnectedSocket() socket: Socket) {
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    socket.nsp.emit('move_pointer', { x, y, userId: userData.userId });
  }

  @SubscribeMessage('select_object')
  async selectObject(@MessageBody('objectId') objectId: string, @ConnectedSocket() socket: Socket) {
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    if (userData.role < 1) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.
    socket.nsp.emit('select_object', { objectId, userId: userData.userId });
  }

  @SubscribeMessage('unselect_object')
  async unselectObject(@MessageBody('objectId') objectId: string, @ConnectedSocket() socket: Socket) {
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    if (userData.role < 1) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.
    socket.nsp.emit('unselect_object', { objectId, userId: userData.userId });
  }

  @SubscribeMessage('create_object')
  async createObject(
    @MessageBody(
      new ValidationPipe({
        exceptionFactory: (errors) => new WsException(`잘못된 속성 전달: ${errors.map((e) => e.property).join(', ')}`),
      }),
    )
    objectData: ObjectDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    if (userData.role < 1) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.

    // Optional 값들 중 값을 채워줘야 하는 것은 값을 넣어준다.
    try {
      if (!objectData.text) objectData.text = '';
      if (isNaN(+objectData.fontSize) || +objectData.fontSize < 0) objectData.fontSize = 16;
      objectData.workspaceId = userData.workspaceId;
      objectData.creator = userData.userId;

      // 생성을 시도하고, 성공하면 이를 전달한다.
      const ret = await this.objectHandlerService.createObject(userData.workspaceId, objectData);
      if (!ret) throw new WsException('생성 실패');
      socket.nsp.emit('create_object', objectData);
    } catch (e) {
      this.logger.error(e);
      throw new WsException(e.message);
    }
  }

  @SubscribeMessage('update_object')
  async updateObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    try {
      const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
      if (userData.role < 1) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.

      // 변경되어서는 안되는 값들은 미리 제거하거나 덮어버린다.
      delete objectData.creator, delete objectData.type;
      if (isNaN(+objectData.fontSize) || +objectData.fontSize < 0) delete objectData.fontSize;
      objectData.workspaceId = userData.workspaceId;

      // 수정을 시도하고, 성공하면 이를 전달한다.
      const ret = await this.objectHandlerService.updateObject(userData.workspaceId, objectData);
      if (!ret) throw new WsException('수정 실패');
      socket.nsp.emit('update_object', objectData);
    } catch (e) {
      this.logger.error(e);
      throw new WsException(e.message);
    }
  }

  @SubscribeMessage('delete_object')
  async deleteObject(@MessageBody('objectId') objectId: string, @ConnectedSocket() socket: Socket) {
    try {
      const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
      if (userData.role < 1) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.

      const ret = await this.objectHandlerService.deleteObject(userData.workspaceId, objectId);
      if (!ret) new WsException('삭제 실패');
      socket.nsp.emit('delete_object', { objectId });
    } catch (e) {
      this.logger.error(e);
      throw new WsException(e.message);
    }
  }
}
