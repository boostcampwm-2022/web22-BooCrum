import { sidebarItems } from '@data/workspace-sidebar';
import { atom } from 'recoil';

export const workspaceTypeState = atom({
	key: 'workspaceType',
	default: Object.keys(sidebarItems)[0],
});
