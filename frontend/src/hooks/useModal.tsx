import { useEffect, useRef, useState } from 'react';

function useModal() {
	const [isOpenModal, setIsOpenModal] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpenModal]);

	const toggleOpenModal = () => {
		setIsOpenModal((isOpen) => !isOpen);
	};

	const openModal = () => {
		setIsOpenModal(true);
	};

	const closeModal = () => {
		setIsOpenModal(false);
	};

	const handleOutsideClick = (e: Event) => {
		const current = modalRef.current;
		if (isOpenModal && current && !current.contains(e.target as Node)) setIsOpenModal(false);
	};

	return { isOpenModal, modalRef, toggleOpenModal, closeModal, openModal };
}

export default useModal;
