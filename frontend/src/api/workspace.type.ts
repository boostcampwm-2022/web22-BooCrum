interface TeamInfo {
	name: 'string';
	isTeam: number;
	description: string;
	teamId: number;
	registerDate: string;
}

export interface WorkspaceData {
	team: TeamInfo;
	name: string;
	description: string;
	workspaceId: string;
	registerDate: string;
	updateDate: string;
}

export interface PostWorkspaceBody {
	teamId?: number;
	name?: string;
	description?: string;
}

export interface PatchWorkspaceBody {
	name?: string;
}

export interface WorkspaceMetaData {
	workspaceId: string;
	description?: string;
	name: string;
	registerData: string;
	updateData: string;
	thumbnailUrl?: string;
}

interface UserInfo {
	userId: string;
	nickname: string;
	registerDate: string;
}

export interface ParticipantInfo {
	id: number;
	role: number;
	updateDate: string;
	user: UserInfo;
}
