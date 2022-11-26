import { Member } from './workspace-member.types';
import { CanvasObject } from './workspace-object.types';

export interface AllWorkspaceData {
	members: Member[];
	objects: CanvasObject[];
}
