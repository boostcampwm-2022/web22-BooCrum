import { colorChips } from '@data/workspace-object-color';
import { toolItems } from '@data/workspace-tool';
import { Member } from '@pages/workspace/whiteboard-canvas/types';
import { ParticipantInfo } from '@pages/workspace/member-role/index.type';
import { atom } from 'recoil';

export const cursorState = atom({
	key: 'cursor',
	default: { type: toolItems.SELECT, x: 0, y: 0, color: colorChips[0] },
});

export const zoomState = atom({
	key: 'zoom',
	default: { percent: 100, event: '' },
});

export const membersState = atom<Member[]>({
	key: 'members',
	default: [],
});

export const workspaceParticipantsState = atom<ParticipantInfo[]>({
	key: 'participants',
	default: [],
});
