import Modal from '@components/modal';
import useModal from '@hooks/useModal';
import { useState } from 'react';

import { WorkspaceMenuItem, WorkspaceMenuList } from './index.style';
import { WorkspaceMenuProps } from './index.types';
import DeleteModal from '../delete-modal';
import RenameModal from '../rename-modal';

function WorkspaceMenu({ role, workspaceName }: WorkspaceMenuProps) {
	const { isOpenModal, modalRef, toggleOpenModal } = useModal();
	const [modalContent, setModalContent] = useState(<></>);
	const openReanmeModal = () => {
		toggleOpenModal();
		setModalContent(<RenameModal toggle={toggleOpenModal} workspaceName={workspaceName}></RenameModal>);
	};
	const openDeleteModal = () => {
		toggleOpenModal();
		setModalContent(<DeleteModal toggle={toggleOpenModal}></DeleteModal>);
	};
	return (
		<>
			<WorkspaceMenuList>
				<WorkspaceMenuItem>Open</WorkspaceMenuItem>
				{role == 2 && <WorkspaceMenuItem onClick={openReanmeModal}>Rename</WorkspaceMenuItem>}
				{role == 2 && <WorkspaceMenuItem onClick={openDeleteModal}>Delete</WorkspaceMenuItem>}
			</WorkspaceMenuList>
			<Modal isOpen={isOpenModal} modalRef={modalRef}>
				{modalContent}
			</Modal>
		</>
	);
}

export default WorkspaceMenu;
