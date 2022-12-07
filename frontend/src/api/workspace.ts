import { TemplateType } from '@pages/main/workspace-template-list/index.type';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import {
	ParticipantInfo,
	PatchWorkspaceBody,
	PostWorkspaceBody,
	WorkspaceData,
	WorkspaceMetaData,
} from './workspace.type';

const instance = axios.create({
	baseURL: '/api/workspace',
	timeout: 15000,
	withCredentials: true,
});

const responseBody = (response: AxiosResponse) => response.data;
const responseStatus = (response: AxiosResponse) => response.status;

const workspaceRequests = {
	get: <T>(url: string, option?: AxiosRequestConfig) => instance.get<T>(url, option).then(responseBody),
	post: <T, B>(url: string, body: B) => instance.post<T>(url, body).then(responseBody),
	patch: <T, B>(url: string, body: B) => instance.patch<T>(url, body).then(responseBody),
	delete: (url: string) => instance.delete<number>(url).then(responseStatus),
};

export const Workspace = {
	postWorkspace: (templateId: string, body: PostWorkspaceBody): Promise<WorkspaceData> =>
		workspaceRequests.post<WorkspaceData, PostWorkspaceBody>(`${templateId ? `?templateId=${templateId}` : ''}`, body),
	patchWorkspace: (workspaceId: string, body: PatchWorkspaceBody): Promise<WorkspaceData> =>
		workspaceRequests.patch<WorkspaceData, PatchWorkspaceBody>(`/${workspaceId}/info/metadata`, body),
	getWorkspaceMetadata: (workspaceId: string): Promise<WorkspaceMetaData> =>
		workspaceRequests.get(`/${workspaceId}/info/metadata`),
	deleteWorkspace: (workspaceId: string): Promise<number> => workspaceRequests.delete(`/${workspaceId}`),
	getWorkspaceParticipant: (workspaceId: string): Promise<ParticipantInfo[]> =>
		workspaceRequests.get<ParticipantInfo[]>(`/${workspaceId}/info/participant`),
	getTemplates: (): Promise<TemplateType[]> => workspaceRequests.get(`/template`),
};
