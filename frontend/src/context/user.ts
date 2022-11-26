import { ProfileData } from '@api/user.types';
import { atom, selector } from 'recoil';
import { User } from '@api/user';

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