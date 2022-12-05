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
import { UserManagementService } from './user-management.service';
import { DbAccessService } from './db-access.service';
import { UserMapVO } from './dto/user-map.vo';
import { ObjectDTO } from './dto/object.dto';
import { UserDAO } from './dto/user.dao';
import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';
import { ObjectMoveDTO } from './dto/object-move.dto';
import { ObjectMapVO } from './dto/object-map.vo';
import { ObjectScaleDTO } from './dto/object-scale.dto';
import { ObjectManagementService } from './object-management.service';

//============================================================================================//
//==================================== Socket.io 서버 정의 ====================================//
//============================================================================================//

@WebSocketGateway(8080, { cors: '*', namespace: /workspace\/.+/ })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');

  constructor(
    private dbAccessService: DbAccessService,
    private dataManagementService: UserManagementService,
    private objectManagementService: ObjectManagementService,
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
      const errMsg = `존재하지 않는 Workspace 접근 / 요청 워크스페이스 ID: ${workspaceId}`;
      this.logger.error(errMsg);
      client.emit('exception', { message: errMsg });
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
    const objects: ObjectMapVO[] = await this.objectManagementService.findAllObjectsInWorkspace(workspaceId);
    const userData = new UserDAO(userMapVO.userId, userMapVO.nickname, userMapVO.color, userMapVO.role);

    // 5. Socket 이벤트 Emit
    client.emit('init', { members, objects, userData });
    client.nsp.emit('enter_user', userData);

    // 6. 접속 시 updateDate 갱신
    if (!userMapVO.isGuest) {
      const res = await this.dbAccessService.renewUpdateDateOfMember(userMapVO.userId, userMapVO.workspaceId);
      if (!res)
        this.logger.error(
          `멤버 최종 updateDate 갱신 실패 (워크스페이스 ID: ${userMapVO.workspaceId}, 유저 ID: ${userMapVO.userId})`,
        );
    }
  }

  /**
   * Disconnect 이벤트가 발생하였을 때 수행할 처리를 기록한다.
   *
   * - **발생 조건**: 클라이언트 측에서 창을 끄거나, disconnect를 실행할 경우.
   *
   * - **server to client**: 'leave_user'
   * @param client 연결을 끊기 직전인(disconnect 이벤트를 발생시킨) 소켓
   */
  async handleDisconnect(client: Socket) {
    const clientId = client.id;
    this.logger.log(`Client disconnected: ${clientId}`);
    try {
      const userData = this.dataManagementService.deleteUserData(client);
      if (userData) client.nsp.emit('leave_user', { userId: userData.userId });
      if (userData && !userData.isGuest) {
        const res = await this.dbAccessService.renewUpdateDateOfMember(userData.userId, userData.workspaceId);
        if (!res)
          this.logger.error(
            `멤버 최종 updateDate 갱신 실패 (워크스페이스 ID: ${userData.workspaceId}, 유저 ID: ${userData.userId})`,
          );
      }
    } catch (e) {
      this.logger.error(`Disconnect Error: ${e.message}`, e.stack);
      throw new WsException(e.message);
    }
  }

  @SubscribeMessage('move_pointer')
  async moveMousePointer(@MessageBody() { x, y }, @ConnectedSocket() socket: Socket) {
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    socket.nsp.emit('move_pointer', { x, y, userId: userData.userId });
  }

  @SubscribeMessage('select_object')
  async selectObject(@MessageBody('objectIds') objectIds: string[], @ConnectedSocket() socket: Socket) {
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    if (userData.role < WORKSPACE_ROLE.EDITOR) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.
    socket.nsp.emit('select_object', { objectIds, userId: userData.userId });
  }

  @SubscribeMessage('unselect_object')
  async unselectObject(@MessageBody('objectIds') objectIds: string[], @ConnectedSocket() socket: Socket) {
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    if (userData.role < WORKSPACE_ROLE.EDITOR) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.
    socket.nsp.emit('unselect_object', { objectIds, userId: userData.userId });
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
    if (userData.role < WORKSPACE_ROLE.EDITOR) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.

    // Optional 값들 중 값을 채워줘야 하는 것은 값을 넣어준다.
    try {
      if (!objectData.text) objectData.text = '';
      if (isNaN(+objectData.fontSize) || +objectData.fontSize < 0) objectData.fontSize = 16;
      objectData.workspaceId = userData.workspaceId;
      objectData.creator = userData.userId;

      // section의 제목의 최대 길이는 50자
      if (objectData.type === 'section' && objectData.text.length > 50) throw new WsException('섹션 제목 길이 초과');

      // 생성을 시도하고, 성공하면 이를 전달한다.
      await this.objectManagementService.insertObjectIntoWorkspace(userData.workspaceId, objectData);
      socket.nsp.emit('create_object', objectData);
    } catch (e) {
      this.logger.error(`Create Error: ${e.message}`, e.stack);
      throw new WsException(e.message);
    }
  }

  @SubscribeMessage('move_object')
  async moveObject(@MessageBody() objectMoveDTO: ObjectMoveDTO, @ConnectedSocket() socket: Socket) {
    // User 권한 체크
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    if (userData.role < WORKSPACE_ROLE.EDITOR) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.

    // 객체 존재 여부 체크 및 조회
    const objectData: ObjectMapVO = await this.objectManagementService.findOneObjectInWorkspace(
      userData.workspaceId,
      objectMoveDTO.objectId,
    );
    if (!objectData) throw new WsException('존재하지 않는 객체 접근');

    // 이벤트 전달
    socket.nsp.emit('move_object', {
      userId: userData.userId,
      objectData: {
        objectId: objectMoveDTO.objectId,
        left: objectMoveDTO.left,
        top: objectMoveDTO.top,
      },
    });
  }

  @SubscribeMessage('scale_object')
  async scaleObject(@MessageBody() objectScaleDTO: ObjectScaleDTO, @ConnectedSocket() socket: Socket) {
    // User 권한 체크
    const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
    if (userData.role < WORKSPACE_ROLE.EDITOR) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.

    // 객체 존재 여부 체크 및 조회
    const objectData: ObjectMapVO = await this.objectManagementService.findOneObjectInWorkspace(
      userData.workspaceId,
      objectScaleDTO.objectId,
    );
    if (!objectData) throw new WsException('존재하지 않는 객체 접근');

    // 이벤트 전달
    socket.nsp.emit('scale_object', {
      userId: userData.userId,
      objectData: {
        objectId: objectScaleDTO.objectId,
        left: objectScaleDTO.left,
        top: objectScaleDTO.top,
        scaleX: objectScaleDTO.scaleX,
        scaleY: objectScaleDTO.scaleY,
      },
    });
  }

  @SubscribeMessage('update_object')
  async updateObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    try {
      const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
      if (userData.role < WORKSPACE_ROLE.EDITOR) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.

      // 변경되어서는 안되는 값들은 미리 제거하거나 덮어버린다.
      delete objectData.creator, delete objectData.type;
      if (isNaN(+objectData.fontSize) || +objectData.fontSize < 0) delete objectData.fontSize;
      objectData.workspaceId = userData.workspaceId;

      // section의 제목의 최대 길이는 50자
      if (objectData.type === 'section' && objectData.text.length > 50) throw new WsException('섹션 제목 길이 초과');

      // 수정을 시도하고, 성공하면 이를 전달한다.

      await this.objectManagementService.updateObjectInWorkspace(userData.workspaceId, objectData);
      socket.nsp.emit('update_object', { userId: userData.userId, objectData });
    } catch (e) {
      this.logger.error(`Update Error: ${e.message}`, e.stack);
      throw new WsException(e.message);
    }
  }

  @SubscribeMessage('delete_object')
  async deleteObject(@MessageBody('objectId') objectId: string, @ConnectedSocket() socket: Socket) {
    try {
      const userData = this.dataManagementService.findUserDataBySocketId(socket.id);
      if (userData.role < WORKSPACE_ROLE.EDITOR) throw new WsException('유효하지 않은 권한입니다.'); // 읽기 권한은 배제한다.

      await this.objectManagementService.deleteObjectInWorkspace(userData.workspaceId, objectId);
      socket.nsp.emit('delete_object', { userId: userData.userId, objectId });
    } catch (e) {
      this.logger.error(`Delete Error: ${e.message}`, e.stack);
      throw new WsException(e.message);
    }
  }
}
