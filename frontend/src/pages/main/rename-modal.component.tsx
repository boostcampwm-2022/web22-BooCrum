import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { RenameModalState } from '../../context/atoms';
import { RenameModalBackground, RenameModalLayout } from './rename-modal.style';

function RenameModal({ setOpenModal }: RenameModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const renameModalState = useRecoilValue(RenameModalState);

	const modifyWorkspaceName = () => {
		setOpenModal(false);
	};

	useEffect(() => {
		const handler: (e: MouseEvent) => void = (e: MouseEvent) => {
			if (e.target instanceof Element)
				if (modalRef.current && !modalRef.current.contains(e.target)) {
					setOpenModal(false);
				}
		};

		document.addEventListener('mousedown', handler);

		return () => {
			document.removeEventListener('mousedown', handler);
		};
	});

	return (
		<>
			<RenameModalLayout ref={modalRef}>
				<h3>Rename</h3>
				<input placeholder="File Name..." value={renameModalState.workspaceName}></input>
				<button onClick={modifyWorkspaceName}>RENAME</button>
			</RenameModalLayout>
			<RenameModalBackground></RenameModalBackground>
		</>
	);
}

export default RenameModal;
