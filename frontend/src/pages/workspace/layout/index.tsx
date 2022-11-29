import Modal from '@components/modal';
import useModal from '@hooks/useModal';
import { useCallback, useState } from 'react';
import Header from '../header';
import ShareModal from '../share-modal';
import Toolkit from '../toolkit';

function Layout({ workspaceId }: { workspaceId: string }) {
	const { isOpenModal, openModal, modalRef, closeModal } = useModal();
	const [modalContent, setModalContent] = useState(<></>);

	const openShareModal = useCallback(() => {
		openModal();
		setModalContent(<ShareModal modalRef={modalRef} id={workspaceId} closeModal={closeModal} />);
	}, []);

	return (
		<>
			<Header workspaceId={workspaceId} openShareModal={openShareModal} />
			<Toolkit />

			<Modal isOpen={isOpenModal} modalRef={modalRef} width={600} height={400}>
				{modalContent}
			</Modal>
		</>
	);
}

export default Layout;
