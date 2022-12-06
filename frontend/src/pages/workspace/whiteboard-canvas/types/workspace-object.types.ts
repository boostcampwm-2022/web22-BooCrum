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
	type?: ObjectType;
	objectId: string;
	left?: number;
	top?: number;
	width?: number;
	height?: number;
	color?: string;
	text?: string;
	fontSize?: number;
	scaleX?: number;
	scaleY?: number;
}

export interface ObjectDataFromServer extends ObjectDataToServer {
	type: SocketObjectType;
	creator: string;
	workspaceId: string;
}

// boocrum에서 논리적으로 관리하는 object type 정의
export const ObjectType = {
	postit: 'postit',
	section: 'section',
	draw: 'draw',
	text: 'text',
	title: 'title',
	nameText: 'nameText',
	cursor: 'cursor',
	rect: 'rect',
	line: 'line',
	editable: 'editable',
} as const;

export type ObjectType = typeof ObjectType[keyof typeof ObjectType];

// 소켓으로 보내는 object typee들
export const SocketObjectType = {
	postit: 'postit',
	section: 'section',
	// draw: 'draw',
} as const;

export type SocketObjectType = typeof SocketObjectType[keyof typeof SocketObjectType];

export const CanvasType = {
	postit: 'postit',
	section: 'section',
	move: 'move',
	select: 'select',
	draw: 'draw',
	edit: 'edit',
	erase: 'erase',
} as const;

export type CanvasType = typeof CanvasType[keyof typeof CanvasType];
