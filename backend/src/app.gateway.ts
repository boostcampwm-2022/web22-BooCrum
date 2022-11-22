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
import * as cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';
import { Workspace } from './workspace/entity/workspace.entity';

class UserData {
  constructor(socketId: string, userId: string, role: number) {
    this.socketId = socketId;
    this.userId = userId;
    this.role = role;
  }

  socketId: string;
  userId: string;
  role: number;
}

@WebSocketGateway(8080, { cors: '*', namespace: /workspace\/.+/ })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private userList = [];

  constructor(private readonly httpService: HttpService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    // 1. Workspace 존재 여부 체크
    const workspaceId = client.nsp.name.match(/workspace\/(.+)/)[1];
    const isValidWorkspace = await this.isExistWorkspace(workspaceId);
    if (!isValidWorkspace) {
      this.logger.log(`존재하지 않는 Workspace 접근`);
      client.disconnect();
    }

    // 2. 쿠키 존재 여부 조회 => 비회원 or 회원
    const cookie = client.handshake.headers.cookie;
    const userId = await this.getUserId(cookie);

    // 3. WorkspaceMember 존재 여부 조회
    const role = await this.getUserRole(workspaceId, userId);

    // 4. room 추가
    client.join(workspaceId);
    this.userList.push(new UserData(client.id, userId, role));
  }

  handleDisconnect(client: Socket) {
    // TODO: userList에서 제거
    client.disconnect();
  }

  @SubscribeMessage('mouse-move')
  moveMouse(@MessageBody() body: string, @ConnectedSocket() socket: Socket) {}

  async isExistWorkspace(workspaceId: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `http://localhost:3000/api/workspace/${workspaceId}/info/metadata`,
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

  async getUserId(cookie: string) {
    if (!cookie) {
      return 'undefined';
    } else {
      const sessionId = cookieParser.signedCookie(decodeURIComponent(cookie.split('=')[1]), process.env.SESSION_SECRET);

      const response = await this.httpService.axiosRef.get(`http://localhost:3000/api/auth/info/${sessionId}`, {
        headers: {
          accept: 'application/json',
        },
      });
      return response.data;
    }
  }

  async getUserRole(workspaceId: string, userId: string) {
    const response = await this.httpService.axiosRef.get(
      `http://localhost:3000/api/workspace/${workspaceId}/role/${userId}`,
      {
        headers: {
          accept: 'application/json',
        },
      },
    );
    return response.data;
  }
}
