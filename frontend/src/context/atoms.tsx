import { atom } from 'recoil';

export const DeleteModalState = atom({
	key: 'deleteModalState',
	default: { isOpen: false },
});

export const RenameModalState = atom({
	key: 'renameModalState',
	default: { isOpen: false, workspaceName: '' },
});
