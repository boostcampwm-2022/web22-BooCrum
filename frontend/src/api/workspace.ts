import axios, { AxiosResponse } from 'axios';
import { PostWorkspaceBody, WorkspaceData } from './workspace.type';

const instance = axios.create({
	baseURL: '/api/workspace',
	timeout: 15000,
	withCredentials: true,
});

const responseBody = (response: AxiosResponse) => response.data;
const responseStatus = (response: AxiosResponse) => response.status;

const workspaceRequests = {
	get: <T>(url: string) => instance.get<T>(url).then(responseBody),
	post: <T, B>(url: string, body: B) => instance.post<T>(url, body).then(responseBody),
	patch: <T, B>(url: string, body: B) => instance.patch<T>(url, body).then(responseBody),
	delete: (url: string) => instance.delete<number>(url).then(responseStatus),
};

export const Workspace = {
	postWorkspace: (body: PostWorkspaceBody): Promise<WorkspaceData> =>
		workspaceRequests.post<WorkspaceData, PostWorkspaceBody>('', body),
};
