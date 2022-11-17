import { atom } from 'recoil';

export const authState = atom({
	key: 'auth',
	default: JSON.parse(localStorage.getItem('auth') || 'false'),
});
