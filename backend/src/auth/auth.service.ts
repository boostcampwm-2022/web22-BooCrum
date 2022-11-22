import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private dataSource: DataSource) {}

  async getSessionData(sessionId: string) {
    return await this.dataSource.query(`SELECT * FROM sessions where session_id = '${sessionId}'`);
  }
}
