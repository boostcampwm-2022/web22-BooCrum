import { Member, UserMousePointer, MousePointer } from './workspace-member.types';
import { CanvasObject, UpdatedObject } from './workspace-object.types';
import { AllWorkspaceData } from './workspace.types';

export interface ServerToClientEvents {
	connect: () => void;
	disconnect: () => void;
	init: (arg: AllWorkspaceData) => void;
	enter_user: (arg: Member) => void;
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
