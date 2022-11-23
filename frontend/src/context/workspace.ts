import { colorChips } from '@data/workspace-object-color';
import { toolItems } from '@data/workspace-tool';
import { atom } from 'recoil';

export const cursorState = atom({
	key: 'cursor',
	default: { type: toolItems.SELECT, x: 0, y: 0, color: colorChips[0] },
});

export const zoomState = atom({
	key: 'zoom',
	default: { percent: 100, event: '' },
});

export const zoomState = atom({
	key: 'zoom',
	default: 100,
});
