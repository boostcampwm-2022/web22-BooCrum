import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getAllObjects(workspaceId: string) {
    const requestURL = `${process.env.API_ADDRESS}/object-database/${workspaceId}/object`;
    return await this.requestAPI(requestURL, 'GET');
  }

  async isExistWorkspace(workspaceId: string) {
    try {
      const requestURL = `${process.env.API_ADDRESS}/workspace/${workspaceId}/info/metadata`;
      const response = await this.requestAPI(requestURL, 'GET');
      if (response) return true;
    } catch (e) {
      return false;
    }
  }

  async getUserRole(workspaceId: string, userId: string) {
    const requestURL = `${process.env.API_ADDRESS}/workspace/${workspaceId}/role/${userId}`;
    return await this.requestAPI(requestURL, 'GET');
  }

  async requestAPI(requestURL: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', body?: object) {
    const headers = { accept: 'application/json' };

    let response: AxiosResponse;

    switch (method) {
      case 'GET':
        response = await this.httpService.axiosRef.get(requestURL, { headers });
        return response.data;
      case 'POST':
        response = await this.httpService.axiosRef.post(requestURL, body, { headers });
        return response.data;
      case 'PATCH':
        response = await this.httpService.axiosRef.patch(requestURL, body, { headers });
        return response.data;
      case 'DELETE':
        response = await this.httpService.axiosRef.delete(requestURL, { headers });
        return response.data;
    }
  }
}
