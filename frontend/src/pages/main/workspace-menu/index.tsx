import Modal from '@components/modal';
import useModal from '@hooks/useModal';
import { useState } from 'react';

import { WorkspaceMenuItem, WorkspaceMenuList } from './index.style';
import { WorkspaceMenuProps } from './index.types';
import DeleteModal from '../delete-modal';
import RenameModal from '../rename-modal';
import { Workspace } from '@api/workspace';

function WorkspaceMenu({ workspaceId, role, workspaceName, setWorkspaceList }: WorkspaceMenuProps) {
	const { isOpenModal, modalRef, toggleOpenModal } = useModal();
	const [modalContent, setModalContent] = useState(<></>);

	const openReanmeModal = () => {
		const renameWorkspace = async (workspaceName: string) => {
			toggleOpenModal();
			await Workspace.patchWorkspace(workspaceId, { name: workspaceName });
			setWorkspaceList();
		};
		toggleOpenModal();
		setModalContent(<RenameModal action={renameWorkspace} workspaceName={workspaceName}></RenameModal>);
	};
	const openDeleteModal = () => {
		const deleteWorkspace = async () => {
			toggleOpenModal();
			await Workspace.deleteWorkspace(workspaceId);
			setWorkspaceList();
		};
		toggleOpenModal();
		setModalContent(<DeleteModal action={deleteWorkspace}></DeleteModal>);
	};
	return (
		<>
			<WorkspaceMenuList>
				<WorkspaceMenuItem>Open</WorkspaceMenuItem>
				{role == 2 && (
					<>
						<WorkspaceMenuItem onClick={openReanmeModal}>Rename</WorkspaceMenuItem>
						<WorkspaceMenuItem onClick={openDeleteModal}>Delete</WorkspaceMenuItem>
					</>
				)}
			</WorkspaceMenuList>
			<Modal isOpen={isOpenModal} modalRef={modalRef}>
				{modalContent}
			</Modal>
		</>
	);
}

export default WorkspaceMenu;
