import Modal from '@components/modal';
import useModal from '@hooks/useModal';
import { useState } from 'react';
import LeftSide from '../left-side';
import RightSide from '../right-side';
import ShareModal from '../share-modal';
import { Container } from './index.style';

interface HeaderProps {
	name: string;
	workspaceId: string;
}

function Header({ name, workspaceId }: HeaderProps) {
	const { isOpenModal, openModal, modalRef, closeModal } = useModal();
	const [modalContent, setModalContent] = useState(<></>);

	const openShareModal = () => {
		openModal();
		setModalContent(<ShareModal modalRef={modalRef} id={workspaceId} closeModal={closeModal} />);
	};

	return (
		<>
			<Container>
				<LeftSide />
				<p className="title">{name}</p>
				<RightSide openShareModal={openShareModal} />
			</Container>

			<Modal isOpen={isOpenModal} modalRef={modalRef} width={600} height={400}>
				{modalContent}
			</Modal>
		</>
	);
}

export default Header;
