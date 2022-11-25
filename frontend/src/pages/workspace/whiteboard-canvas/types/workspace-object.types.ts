export interface UpdatedObject {
	objectId: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	backgroundColor?: string;
	createdBy?: string;
	text?: string;
}

export interface CanvasObject {
	type: CanvasType;
	objectId: string;
	xPos?: number;
	yPos?: number;
	width?: number;
	height?: number;
	color?: string;
	creator?: string;
	text?: string;
}

export const CanvasType = {
	postit: 'postit',
	section: 'section',
	move: 'move',
	select: 'select',
	draw: 'draw',
} as const;

export type CanvasType = typeof CanvasType[keyof typeof CanvasType];
