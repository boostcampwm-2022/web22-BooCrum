import { WorkspaceCardType } from '@pages/main/workspace-list/index.type';
import axios, { AxiosResponse } from 'axios';
import { TeamData, ProfileData, WorkspaceData, UserData, PatchProfileBody } from './user.types';

export async function fetchWorkspaceList(): Promise<WorkspaceCardType[]> {
	const result = await axios.get('https://7f09d24e-a8d4-4e68-a7c5-ec8c6da7ef40.mock.pstmn.io/user/info/workspace');
	return result.data;
}

const instance = axios.create({
	baseURL: '/api/user',
	timeout: 15000,
	withCredentials: true,
});

const responseBody = (response: AxiosResponse) => response.data;
const responseStatus = (response: AxiosResponse) => response.status;

const userRequests = {
	get: <T>(url: string) => instance.get<T>(url).then(responseBody),
	patch: <T, B>(url: string, body: B) => instance.patch<T>(url, body).then(responseBody),
	delete: (url: string) => instance.delete<number>(url).then(responseStatus),
};

export const User = {
	getProfile: (): Promise<ProfileData> => userRequests.get<ProfileData>('/info/profile'),
	getTeam: (): Promise<TeamData[]> => userRequests.get<TeamData[]>('/info/team'),
	getWorkspace: (): Promise<WorkspaceData[]> => userRequests.get<TeamData[]>('/info/workspace'),
	getAll: (): Promise<UserData> => userRequests.get<UserData>('/info'),
	patchProfile: (body: PatchProfileBody): Promise<ProfileData> =>
		userRequests.patch<ProfileData, PatchProfileBody>('/info', body),
	deleteUser: (): Promise<number> => userRequests.delete(''),
	getAllById: (userId: string): Promise<UserData> => userRequests.get<UserData>(`${userId}/info`),
	getProfileById: (userId: string): Promise<ProfileData> => userRequests.get<ProfileData>(`${userId}/info/profile`),
	getTeamById: (userId: string): Promise<TeamData[]> => userRequests.get<TeamData[]>(`${userId}/info/team`),
	getWorkspaceById: (userId: string): Promise<WorkspaceData[]> =>
		userRequests.get<WorkspaceData[]>(`${userId}/info/workspace`),
};
