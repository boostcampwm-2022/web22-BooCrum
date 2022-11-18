import { WorkspaceCardType } from '@pages/main/workspace-list/index.type';
import axios from 'axios';

export async function fetchWorkspaceList(): Promise<WorkspaceCardType[]> {
	const result = await axios.get('https://7f09d24e-a8d4-4e68-a7c5-ec8c6da7ef40.mock.pstmn.io/user/info/workspace');
	return result.data;
}

export async function fetchMockUser(): Promise<{ nickname: string }> {
	const result = await axios.get('https://7f09d24e-a8d4-4e68-a7c5-ec8c6da7ef40.mock.pstmn.io/user/info/profile');
	return result.data;
}
