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
	teamId: number;
	name: string;
	description: string;
}