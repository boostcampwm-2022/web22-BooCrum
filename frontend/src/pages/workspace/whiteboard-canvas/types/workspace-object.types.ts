export interface CanvasObject {
	objectId: string;
	type?: ObjectType;
	left?: number;
	top?: number;
	width?: number;
	height?: number;
	fill?: string;
	text?: string;
	fontSize?: number;
}

export interface ObjectDataToServer {
	type: ObjectType;
	objectId: string;
	left?: number;
	top?: number;
	width?: number;
	height?: number;
	color?: string;
	text?: string;
	fontSize?: number;
}

export interface ObjectDataFromServer extends ObjectDataToServer {
	creator: string;
	workspaceId: string;
}

export type ObjectType = 'postit' | 'section' | 'draw';

export const CanvasType = {
	postit: 'postit',
	section: 'section',
	move: 'move',
	select: 'select',
	draw: 'draw',
} as const;

export type CanvasType = typeof CanvasType[keyof typeof CanvasType];
