import { HttpService } from '@nestjs/axios';
import { BadRequestException, Logger } from '@nestjs/common';
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
import { AxiosResponse } from 'axios';
import { Server, Socket } from 'socket.io';
import { createSessionMiddleware } from '../middlewares/session.middleware';
import { Request, Response, NextFunction } from 'express';
import { UserMapVO } from '../user-map.vo';
import { ObjectDTO } from '../object.dto';
import { ObjectHandlerService } from 'src/object-database/object-handler.service';

//============================================================================================//
//==================================== Socket.io 서버 정의 ====================================//
//============================================================================================//

@WebSocketGateway(8080, { cors: '*', namespace: /workspace\/.+/ })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');
  private userMap = new Map<string, UserMapVO>();

  constructor(private readonly httpService: HttpService, private objectHandlerService: ObjectHandlerService) {}

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

    const workspaceId = client.nsp.name.match(/workspace\/(.+)/)[1];
    const isValidWorkspace = await this.isExistWorkspace(workspaceId);
    if (!isValidWorkspace) {
      this.logger.log(`존재하지 않는 Workspace 접근`);
      client.disconnect();
      return;
    }

    // 2. 쿠키 존재 여부 조회 => 비회원 or 회원
    const userId = client.request.session.user?.userId;

    // 3. WorkspaceMember 존재 여부 조회 후 role 부여
    const role = await this.getUserRole(workspaceId, userId);

    // 4. Random 색상 지정
    const color = `#${Math.round(Math.random() * 0xffffff).toString(16)}`;

    // 5. room 추가
    //! Dynamic Namespace를 사용함으로써, 네임스페이스가 자동으로 워크스페이스 각각을 의미하게 됨.
    //! 그러한 이유로 workspaceId에 대한 room 추가가 무의미해짐.
    // client.join(workspaceId);
    if (userId !== undefined) client.join(userId);

    // 6. userMap 추가
    this.userMap.set(client.id, new UserMapVO(userId, workspaceId, role, color));

    // 7. Socket.io - Client 이벤트 호출
    const members = Array.from(this.userMap.values())
      .filter((vo) => vo.workspaceId === workspaceId)
      .map((vo) => vo.userId);
    const objects = await this.objectHandlerService.selectAllObjects(workspaceId);

    client.emit('init', { members, objects });
    //? 자신 포함이야... 자신 제외하고 보내야 하는거야...?
    client.broadcast.emit('enter_user', userId);
    // client.nsp.emit('enter_user', userId);
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
    //this.server.to(this.userMap.get(socket.id).workspaceId).emit('move_pointer', { x, y });
  }

  @SubscribeMessage('select_object')
  async selectObject(@MessageBody() objectId: string, @ConnectedSocket() socket: Socket) {
    const userId = this.userMap.get(socket.id)?.userId;
    if (!userId) return;
    socket.nsp.emit('select_object', { objectId, userId });
    //this.server.to(this.userMap.get(socket.id).workspaceId).emit('select_object', objectId);
  }

  @SubscribeMessage('unselect_object')
  async unselectObject(@MessageBody() objectId: string, @ConnectedSocket() socket: Socket) {
    const userId = this.userMap.get(socket.id)?.userId;
    if (!userId) return;
    socket.nsp.emit('unselect_object', { objectId, userId });
    //this.server.to(this.userMap.get(socket.id).workspaceId).emit('unselect_object', objectId);
  }

  @SubscribeMessage('create_object')
  async createObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    // await this.objectHandlerService.createObject(workspaceId, objectData);
    await this.requestAPI(`${process.env.API_ADDRESS}/object-database/${workspaceId}/object`, 'POST', objectData);
    socket.nsp.emit('create_object', objectData);
    //this.server.to(workspaceId).emit('create_object', objectData);
  }

  @SubscribeMessage('update_object')
  async updateObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    const ret = await this.requestAPI(
      `${process.env.API_ADDRESS}/object-database/${workspaceId}/object/${objectData.objectId}`,
      'PATCH',
      objectData,
    );
    if (!ret) throw new WsException('업데이트 실패');
    socket.nsp.emit('update_object', objectData);
    // this.server.to(this.userMap.get(socket.id).workspaceId).emit('update_object', objectData);
    // else throw new BadRequestException();
    // WebSocket은 자체적인 오류 체계가 있습니다...
  }

  @SubscribeMessage('delete_object')
  async deleteObject(@MessageBody() objectId: string, @ConnectedSocket() socket: Socket) {
    const workspaceId = this.userMap.get(socket.id).workspaceId;
    await this.requestAPI(`${process.env.API_ADDRESS}/object-database/${workspaceId}/object/${objectId}`, 'DELETE');
    socket.nsp.emit('delete_object', objectId);
    // this.server.to(this.userMap.get(socket.id).workspaceId).emit('delete_object', objectId);
  }

  async isExistWorkspace(workspaceId: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${process.env.API_ADDRESS}/workspace/${workspaceId}/info/metadata`,
        {
          headers: {
            accept: 'application/json',
          },
        },
      );
      if (response.data) return true;
    } catch (e) {
      return false;
    }
  }

  async getUserRole(workspaceId: string, userId: string) {
    const response = await this.httpService.axiosRef.get(
      `${process.env.API_ADDRESS}/workspace/${workspaceId}/role/${userId}`,
      {
        headers: {
          accept: 'application/json',
        },
      },
    );
    return response.data;
  }

  async requestAPI(address: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', body?: object) {
    const headers = {
      accept: 'application/json',
    };

    let response: AxiosResponse;

    switch (method) {
      case 'GET':
        response = await this.httpService.axiosRef.get(address, { headers });
        return response.data;
      case 'POST':
        response = await this.httpService.axiosRef.post(address, body, { headers });
        return response.data;
      case 'PATCH':
        response = await this.httpService.axiosRef.patch(address, body, { headers });
        return response.data;
      case 'DELETE':
        response = await this.httpService.axiosRef.delete(address, { headers });
        return response.data;
    }
  }
}
