import { Member, UserMousePointer, MousePointer } from './workspace-member.types';
import { ObjectDataFromServer, ObjectDataToServer } from './workspace-object.types';
import { AllWorkspaceData } from './workspace.types';

export interface ServerToClientEvents {
	connect: () => void;
	disconnect: () => void;
	init: (arg: AllWorkspaceData) => void;
	enter_user: (arg: Member) => void;
	leave_user: (arg: { userId: string }) => void;
	move_pointer: (arg: UserMousePointer) => void;
	select_object: (arg: { userId: string; objectIds: string[] }) => void;
	unselect_object: (arg: { userId: string; objectIds: string[] }) => void;
	create_object: (arg: ObjectDataFromServer) => void;
	delete_object: (arg: { userId: string; objectId: string }) => void;
	update_object: (arg: { userId: string; objectData: ObjectDataFromServer }) => void;
	move_object: (arg: { userId: string; objectData: ObjectDataFromServer }) => void;
	scale_object: (arg: { userId: string; objectData: ObjectDataFromServer }) => void;
	exception: (arg: any) => void;
}

export interface ClientToServerEvents {
	move_pointer: (arg: MousePointer) => void;
	select_object: (arg: { objectIds: string[] }) => void;
	unselect_object: (arg: { objectIds: string[] }) => void;
	create_object: (arg: ObjectDataToServer) => void;
	delete_object: (arg: { objectId: string }) => void;
	update_object: (arg: ObjectDataToServer) => void;
	move_object: (arg: ObjectDataToServer) => void;
	scale_object: (arg: ObjectDataToServer) => void;
}
