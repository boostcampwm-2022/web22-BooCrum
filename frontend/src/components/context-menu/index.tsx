import useContextMenu from '@hooks/useContextMenu';
import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { DeleteModalState, RenameModalState } from '../../context/atoms';
import { ContextMeueLayout } from './index.style';
function ContextMenu({ menuRef, toggleOpen, workspacename }: ContextMenuProps) {
	// const menuRef = useRef<HTMLUListElement>(null);

	const setDeleteOpenModal = useSetRecoilState(DeleteModalState);
	const setRenameOpenModal = useSetRecoilState(RenameModalState);

	const openDeleteModal = () => {
		setDeleteOpenModal({ isOpen: true });
		toggleOpen();
	};
	const openRenameModal = () => {
		setRenameOpenModal({ isOpen: true, workspaceName: workspacename });
		toggleOpen();
	};

	return (
		<>
			<ContextMeueLayout ref={menuRef}>
				<li>Open</li>
				<li onClick={openRenameModal}>Rename</li>
				<li onClick={openDeleteModal}>Delete</li>
			</ContextMeueLayout>
		</>
	);
}

export default ContextMenu;
