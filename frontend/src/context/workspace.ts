import { colorChips } from '@data/workspace-object-color';
import { toolItems } from '@data/workspace-tool';
import { Member } from '@pages/workspace/whiteboard-canvas/types';
import { ParticipantInfo } from '@pages/workspace/member-role/index.type';
import { atom, selector } from 'recoil';
import { Workspace } from '@api/workspace';

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

export const workspaceIdState = atom<string>({
	key: 'workspaceId',
	default: '',
});

export const workspaceParticipantsSelector = selector({
	key: 'WPState',
	get: async ({ get }): Promise<ParticipantInfo[]> => {
		const wid = get(workspaceIdState);
		if (!wid) return [];

		return await Workspace.getWorkspaceParticipant(wid);
	},
});
