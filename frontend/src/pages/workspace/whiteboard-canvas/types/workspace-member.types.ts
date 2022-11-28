export interface Member {
	userId: string;
	nickname: string;
	color: string;
	Role: string;
}

export interface MousePointer {
	x: number;
	y: number;
}

export interface UserMousePointer extends MousePointer {
	userId: string;
}

export interface MemberInCanvas {
	userId: string;
	color: string;
	selectedObjectId?: string;
	cursorObject: fabric.Path;
}
