import { atom, RecoilLoadable } from 'recoil';

export const authAtom = atom({
	key: 'auth',
	default: RecoilLoadable.of(
		new Promise((resolve, reject) => {
			setInterval(() => {
				resolve(true);
			}, 2000);
		})
	),
});
