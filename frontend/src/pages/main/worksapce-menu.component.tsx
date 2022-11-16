import Modal from '@components/modal';
import useModal from '@hooks/useModal';
import { useState } from 'react';
import DeleteModal from './delete-modal.component';
import RenameModal from './rename-modal.component';
import { WorkspaceMenuItem, WorkspaceMenuList } from './worksapce-menu.style';
import { WorkspaceMenuProps } from './worksapce-menu.types';

function WorkspaceMenu({ workspaceName }: WorkspaceMenuProps) {
	const { isOpenModal, modalRef, toggleOpenModal, closeModal } = useModal();
	const [modalContent, setModalContent] = useState(<></>);
	const openReanmeModal = () => {
		toggleOpenModal();
		setModalContent(<RenameModal closeModal={closeModal} workspaceName={workspaceName}></RenameModal>);
	};
	const openDeleteModal = () => {
		toggleOpenModal();
		console.log(isOpenModal);
		setModalContent(<DeleteModal closeModal={closeModal}></DeleteModal>);
	};
	return (
		<>
			<WorkspaceMenuList>
				<WorkspaceMenuItem>Open</WorkspaceMenuItem>
				<WorkspaceMenuItem onClick={openReanmeModal}>Rename</WorkspaceMenuItem>
				<WorkspaceMenuItem onClick={openDeleteModal}>Delete</WorkspaceMenuItem>
			</WorkspaceMenuList>
			<Modal isOpen={isOpenModal} modalRef={modalRef}>
				{modalContent}
			</Modal>
		</>
	);
}

export default WorkspaceMenu;
