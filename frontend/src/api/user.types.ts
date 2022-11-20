export interface ProfileData {
	userId: string;
	nickname: string;
	registerDate: string;
}

type Role = 0 | 1 | 2;

interface TeamInfo {
	name: 'string';
	isTeam: number;
	description: string;
	teamId: number;
	registerDate: string;
}

export interface TeamData {
	team: TeamInfo;
	role: Role;
}

interface WorkspaceInfo {
	workspaceId: 'string';
	description: null;
	name: 'string';
	registerDate: 'string';
	updateDate: 'string';
}

export interface WorkspaceData {
	workspace: WorkspaceInfo;
	role: Role;
}

export interface UserData extends ProfileData {
	teamMember: TeamData[];
	workspaceMember: WorkspaceData[];
}

export interface PatchProfileBody {
	nickname: string;
}
