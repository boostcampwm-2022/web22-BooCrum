interface UserInfo {
	userId: string;
	nickname: string;
	registerDate: string;
}

export type Role = 0 | 1 | 2;

export interface MemberInfoProps {
	participant: {
		id: number;
		role: Role;
		updateDate: string;
		user: UserInfo;
	};
}
