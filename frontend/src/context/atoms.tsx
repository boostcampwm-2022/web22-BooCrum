import { atom } from 'recoil';

export const DeleteModalState = atom({
	key: 'deleteModalState',
	default: { isOpen: false },
});
