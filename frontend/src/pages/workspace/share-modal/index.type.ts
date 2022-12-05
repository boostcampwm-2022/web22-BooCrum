export interface ShareModalProps {
	id: string;
}

interface UserInfo {
	userId: string;
	nickname: string;
	registerDate: string;
}

type Role = 0 | 1 | 2;

export interface ParticipantInfo {
	id: number;
	role: Role;
	updateDate: string;
	user: UserInfo;
}
