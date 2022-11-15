import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { DeleteModalState, RenameModalState } from '../../context/atoms';
import { ContextMeueLayout } from './index.style';
function ContextMenu({ setOpenMenu, workspacename }: ContextMenuProps) {
	const menuRef = useRef<HTMLUListElement>(null);
	const setDeleteOpenModal = useSetRecoilState(DeleteModalState);
	const setRenameOpenModal = useSetRecoilState(RenameModalState);

	const openDeleteModal = () => {
		setDeleteOpenModal({ isOpen: true });
		setOpenMenu(false);
	};
	const openRenameModal = () => {
		setRenameOpenModal({ isOpen: true, workspaceName: workspacename });
		setOpenMenu(false);
	};

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (e.target instanceof Element)
				if (menuRef.current && !menuRef.current.contains(e.target)) {
					setOpenMenu(false);
				}
		};

		document.addEventListener('mousedown', handler);
		return () => {
			document.removeEventListener('mousedown', handler);
		};
	});

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
