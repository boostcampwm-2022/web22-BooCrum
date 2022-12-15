interface RoleType {
	[index: string]: number;
}

export const workspaceRole: RoleType = {
	OWNER: 2,
	EDITOR: 1,
	GUEST: 0,
};

type RoleText = 'owner' | 'editor' | 'guest';
type Role = 2 | 1 | 0;

interface RoleArrayType {
	id: number;
	roleText: RoleText;
	roleIndex: Role;
}

export const workspaceRoleArr: RoleArrayType[] = [
	{ id: 0, roleText: 'owner', roleIndex: 2 },
	{ id: 1, roleText: 'editor', roleIndex: 1 },
	{ id: 2, roleText: 'guest', roleIndex: 0 },
];
