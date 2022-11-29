import { Member } from './workspace-member.types';
import { ObjectDataFromServer } from './workspace-object.types';

export interface AllWorkspaceData {
	members: Member[];
	objects: ObjectDataFromServer[];
	userData: Member;
}
