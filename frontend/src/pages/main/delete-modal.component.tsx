import React, { useEffect, useRef } from 'react';
import { DeleteModalBackground, DeleteModalLayout } from './delete-modal.style';

function DeleteModal({ setOpenModal }: DeleteModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	const deleteWorkspace = () => {
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
			<DeleteModalLayout ref={modalRef}>
				<h3>Delete</h3>
				<div>정말 삭제하시겠습니까?</div>
				<button onClick={deleteWorkspace}>DELETE</button>
			</DeleteModalLayout>
			<DeleteModalBackground></DeleteModalBackground>
		</>
	);
}

export default DeleteModal;
