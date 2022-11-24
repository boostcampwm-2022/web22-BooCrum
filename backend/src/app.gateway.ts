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
} from '@nestjs/websockets';
import { AxiosResponse } from 'axios';
import * as cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';
import { createSessionMiddleware } from './util/session.util';
import { Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';
import { UserMapVO } from './user-map.vo';
import { ObjectDTO } from './object.dto';

declare module 'http' {
  interface IncomingMessage {
    session: Session & {
      authenticated: boolean;
    };
  }
}

const API_ADDRESS = process.env.API_ADDRESS;

//============================================================================================//
//==================================== Socket.io 서버 정의 ====================================//
//============================================================================================//

@WebSocketGateway(8080, { cors: '*', namespace: /workspace\/.+/ })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private userMap = new Map<string, UserMapVO>();

  constructor(private readonly httpService: HttpService) {}

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
    const cookie = client.handshake.headers.cookie;
    const userId = await this.getUserId(cookie, client.id);

    // 3. WorkspaceMember 존재 여부 조회 후 role 부여
    const role = await this.getUserRole(workspaceId, userId);

    // 4. Random 색상 지정
    const color = `#${Math.round(Math.random() * 0xffffff).toString(16)}`;

    // 5. room 추가
    client.join(workspaceId);
    client.join(userId);

    // 6. userMap 추가
    this.userMap.set(client.id, new UserMapVO(userId, workspaceId, role, color));

    // 7. Socket.io - Client 이벤트 호출
    const members = Array.from(this.userMap.values())
      .filter((vo) => vo.workspaceId === workspaceId)
      .map((vo) => vo.userId);
    const objects = await this.getAllObjects(workspaceId);

    client.emit('init', { members, objects });
    this.server.to(workspaceId).emit('enter_user', userId);
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    this.logger.log(`Client disconnected: ${clientId}`);

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
    this.server.to(this.userMap.get(socket.id).workspaceId).emit('move_pointer', { x, y });
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
    await this.requestAPI(
      `${API_ADDRESS}/object-database/694cc960-0aed-4292-8eac-4a7f447f42ae/object`,
      'POST',
      objectData,
    );
    this.server.to(this.userMap.get(socket.id).workspaceId).emit('create_object', objectData);
  }

  @SubscribeMessage('update_object')
  async updateObject(@MessageBody() objectData: ObjectDTO, @ConnectedSocket() socket: Socket) {
    const ret = await this.requestAPI(
      `${API_ADDRESS}/object-database/694cc960-0aed-4292-8eac-4a7f447f42ae/object/${objectData.objectId}`,
      'PATCH',
      objectData,
    );
    if (ret) this.server.to(this.userMap.get(socket.id).workspaceId).emit('update_object', objectData);
    else throw new BadRequestException();
  }

  @SubscribeMessage('delete_object')
  async deleteObject(@MessageBody() objectId: string, @ConnectedSocket() socket: Socket) {
    await this.requestAPI(
      `${API_ADDRESS}/object-database/694cc960-0aed-4292-8eac-4a7f447f42ae/object/${objectId}`,
      'DELETE',
    );
    this.server.to(this.userMap.get(socket.id).workspaceId).emit('delete_object', objectId);
  }

  async getAllObjects(workspaceId: string) {
    // TODO: Workspace에 해당하는 객체 API 호출 -> 객체 리스트 반환
    return await this.requestAPI(`${API_ADDRESS}/object-database/${workspaceId}/object`, 'GET');
  }

  async isExistWorkspace(workspaceId: string) {
    try {
      const response = await this.httpService.axiosRef.get(`${API_ADDRESS}/workspace/${workspaceId}/info/metadata`, {
        headers: {
          accept: 'application/json',
        },
      });
      if (response.data) return true;
    } catch (e) {
      return false;
    }
  }

  async getUserId(cookie: string, clientId: string) {
    if (!cookie) {
      return clientId;
    } else {
      const sessionId = cookieParser.signedCookie(decodeURIComponent(cookie.split('=')[1]), process.env.SESSION_SECRET);

      const response = await this.httpService.axiosRef.get(`${API_ADDRESS}/auth/info/${sessionId}`, {
        headers: {
          accept: 'application/json',
        },
      });
      return response.data;
    }
  }

  async getUserRole(workspaceId: string, userId: string) {
    const response = await this.httpService.axiosRef.get(`${API_ADDRESS}/workspace/${workspaceId}/role/${userId}`, {
      headers: {
        accept: 'application/json',
      },
    });
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
