interface Member {
	userId: string;
	nickname: string;
	color: string;
}

interface MousePointer {
	x: number;
	y: number;
}

interface UserMousePointer extends MousePointer {
	userId: string;
}

interface MemberInCanvas {
	userId: string;
	color: string;
	selectedObjectId?: string;
	cursorObject: fabric.Path;
}
