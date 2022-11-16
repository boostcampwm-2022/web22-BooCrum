import { atom, RecoilLoadable } from 'recoil';

export const authState = atom({
	key: 'auth',
	default: false,
});
