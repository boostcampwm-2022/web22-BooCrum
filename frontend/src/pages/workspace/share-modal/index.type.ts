import { RefObject } from 'react';

export interface ShareModalProps {
	id: string;
	modalRef: RefObject<HTMLDivElement>;
	closeModal: () => void;
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
