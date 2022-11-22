import { toolItems } from '@data/workspace-tool';
import { atom } from 'recoil';

export const cursorState = atom({
	key: 'cursor',
	default: toolItems.SELECT,
});
