export interface ShareModalProps {
	id: string;
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
