interface RoleType {
	[index: string]: number;
}

export const workspaceRole: RoleType = {
	OWNER: 2,
	EDITOR: 1,
	GUEST: 0,
};
