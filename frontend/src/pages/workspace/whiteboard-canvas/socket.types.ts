import { CanvasObject } from './index.types';
export interface ServerToClientEvents {
	connect: () => void;
	disconnect: () => void;
	init: (arg: AllWorkspaceData) => void;
	enter_user: (arg: { userData: Member }) => void;
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

export interface AllWorkspaceData {
	members: Member[];
	objects: CanvasObject[];
}

export interface Member {
	userId: string;
	nickname: string;
	color: string;
}

export interface MousePointer {
	x: number;
	y: number;
}

export interface UserMousePointer extends MousePointer {
	userId: string;
}

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
