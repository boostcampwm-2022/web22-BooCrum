import Modal from '@components/modal';
import useModal from '@hooks/useModal';
import { useState, useEffect } from 'react';
import LeftSide from '../left-side';
import RightSide from '../right-side';
import ShareModal from '../share-modal';
import { Container } from './index.style';
import { Workspace } from '@api/workspace';

interface HeaderProps {
	workspaceId: string;
}

function Header({ workspaceId }: HeaderProps) {
	const [workspace, setWorkspaceName] = useState<string>('');
	const { isOpenModal, openModal, modalRef, closeModal } = useModal();
	const [modalContent, setModalContent] = useState(<></>);

	useEffect(() => {
		async function getMetaData() {
			const { name } = await Workspace.getWorkspaceMetadata(workspaceId);
			setWorkspaceName(name);
		}
		getMetaData();
	}, []);

	const openShareModal = () => {
		openModal();
		setModalContent(<ShareModal modalRef={modalRef} id={workspaceId} closeModal={closeModal} />);
	};

	return (
		<>
			<Container>
				<LeftSide />
				<p className="title">{workspace}</p>
				<RightSide openShareModal={openShareModal} />
			</Container>

			<Modal isOpen={isOpenModal} modalRef={modalRef} width={600} height={400}>
				{modalContent}
			</Modal>
		</>
	);
}

export default Header;
