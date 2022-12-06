import { Member } from './workspace-member.types';
import { ObjectDataFromServer } from './workspace-object.types';

export interface AllWorkspaceData {
	members: Member[];
	objects: ObjectDataFromServer[];
	userData: Member;
}

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
