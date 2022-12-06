interface UserInfo {
	userId: string;
	nickname: string;
	registerDate: string;
}

export type Role = 0 | 1 | 2;

export interface ParticipantInfo {
	id: number;
	role: Role;
	updateDate: string;
	user: UserInfo;
}

export interface MemberRoleProps {
	participant: ParticipantInfo;
	handleRole: (userId: string, role: Role) => void;
}
