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

interface UpdatedObject {
	objectId: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	backgroundColor?: string;
	createdBy?: string;
	text?: string;
}

interface AllWorkspaceData {
	members: Member[];
	objects: CanvasObject[];
}
