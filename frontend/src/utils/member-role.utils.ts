import { workspaceRole } from '@data/workspace-role';

export function convertRole(role: number): string {
	if (role === workspaceRole.OWNER) return 'owner';
	else if (role === workspaceRole.EDITOR) return 'editor';
	else return 'guest';
}
