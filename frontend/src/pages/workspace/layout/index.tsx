import Modal from '@components/modal';
import { myInfoInWorkspaceState } from '@context/user';
import { workspaceRole } from '@data/workspace-role';
import useModal from '@hooks/useModal';
import { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Header from '../header';
import ShareModal from '../share-modal';
import Toolkit from '../toolkit';

function Layout({ workspaceId }: { workspaceId: string }) {
	const { isOpenModal, openModal, modalRef, closeModal } = useModal();
	const [modalContent, setModalContent] = useState(<></>);
	const myInfoInWorkspace = useRecoilValue(myInfoInWorkspaceState);

	const openShareModal = useCallback(() => {
		openModal();
		setModalContent(<ShareModal id={workspaceId} closeModal={closeModal} />);
	}, []);

	return (
		<>
			<Header workspaceId={workspaceId} openShareModal={openShareModal} />
			{myInfoInWorkspace.role !== workspaceRole.GUEST && <Toolkit />}

			<Modal isOpen={isOpenModal} modalRef={modalRef} width={600} height={400} title="Share" closeModal={closeModal}>
				{modalContent}
			</Modal>
		</>
	);
}

export default Layout;
