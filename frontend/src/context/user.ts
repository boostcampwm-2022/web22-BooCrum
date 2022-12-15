import { ProfileData } from '@api/user.types';
import { atom, selector } from 'recoil';
import { User } from '@api/user';
import { workspaceRole } from '@data/workspace-role';

export const authState = atom({
	key: 'auth',
	default: JSON.parse(localStorage.getItem('auth') || 'false'),
});

export const userProfileState = selector({
	key: 'useProfile',
	get: async ({ get }): Promise<ProfileData> => {
		const isAuth = get(authState);
		if (!isAuth) return { userId: '', nickname: '', registerDate: '' };

		return await User.getProfile();
	},
});

export const myInfoInWorkspaceState = atom({
	key: 'infoInWorkspace',
	default: { userId: '', nickname: '', color: '', role: workspaceRole.GUEST as Role },
});

type Role = 0 | 1 | 2;
