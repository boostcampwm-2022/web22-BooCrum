import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { DeleteModalState } from '../../context/atoms';
import { ContextMeueLayout } from './index.style';
function ContextMenu({ setOpenMenu }: ContextMenuProps) {
	const menuRef = useRef<HTMLUListElement>(null);
	const setDeleteOpenModal = useSetRecoilState(DeleteModalState);

	const openDeleteModal = () => {
		setDeleteOpenModal({ isOpen: true });
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
				<li>Rename</li>
				<li onClick={openDeleteModal}>Delete</li>
			</ContextMeueLayout>
		</>
	);
}

export default ContextMenu;
