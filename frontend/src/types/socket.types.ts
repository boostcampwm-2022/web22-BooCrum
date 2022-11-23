export interface ServerToClientEvents {
	connect: () => void;
	disconnect: () => void;
	init: (arg: AllWorkspaceData) => void;
	enter_user: (arg: { userData: CanvasObject }) => void;
	leave_user: (arg: { userId: string }) => void;
	move_pointer: (arg: UserMousePointer) => void;
	select_object: (arg: { userId: string; objectId: string }) => void;
	unselect_object: (arg: { userId: string; objectId: string }) => void;
	create_object: (arg: { objectData: CanvasObject }) => void;
	delete_object: (arg: { objectId: string }) => void;
	update_object: (arg: { objectData: CanvasObject }) => void;
}

export interface ClientToServerEvents {
	move_pointer: (arg: MousePointer) => void;
	select_object: (arg: { objectId: string }) => void;
	unselect_object: (arg: { objectId: string }) => void;
	create_object: (arg: { objectData: CanvasObject }) => void;
	delete_object: (arg: { objectId: string }) => void;
	update_object: (arg: UpdatedObject) => void;
}

interface AllWorkspaceData {
	members: Member[];
	objects: CanvasObject[];
}

interface Member {
	userId: string;
	nickname: string;
	color: string;
}

interface CanvasObject {
	type: 'postit' | 'section' | 'draw';
	objectId: string;
	x: number;
	y: number;
	width: number;
	height: number;
	backgroundColor: string;
	createdBy: string;
	text?: string;
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
