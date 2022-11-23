import { colorChips } from '@data/workspace-object-color';
import { toolItems } from '@data/workspace-tool';
import { atom } from 'recoil';

export const cursorState = atom({
	key: 'cursor',
	default: { type: toolItems.SELECT, x: 0, y: 0, color: colorChips[0] },
});
