import Modal from '@components/modal';
import useModal from '@hooks/useModal';
import { useState } from 'react';

import { WorkspaceMenuItem, WorkspaceMenuList } from './index.style';
import { WorkspaceMenuProps } from './index.types';
import DeleteModal from '../delete-modal';
import RenameModal from '../rename-modal';
import { Workspace } from '@api/workspace';
import { workspaceRole } from '@data/workspace-role';
import { useNavigate } from 'react-router';

function WorkspaceMenu({ workspaceId, role, workspaceName, setWorkspaceList }: WorkspaceMenuProps) {
	const { isOpenModal, modalRef, toggleOpenModal, closeModal } = useModal();
	const [modalContent, setModalContent] = useState(<></>);
	const [title, setTitle] = useState('');
	const navigate = useNavigate();

	const handleRouting = () => {
		navigate(`/workspace/${workspaceId}`, { state: { workspaceId, name: title } });
	};

	const openReanmeModal = () => {
		const renameWorkspace = async (workspaceName: string) => {
			toggleOpenModal();
			await Workspace.patchWorkspace(workspaceId, { name: workspaceName });
			setWorkspaceList();
		};
		toggleOpenModal();
		setTitle('Rename');
		setModalContent(<RenameModal action={renameWorkspace} workspaceName={workspaceName}></RenameModal>);
	};
	const openDeleteModal = () => {
		const deleteWorkspace = async () => {
			toggleOpenModal();
			await Workspace.deleteWorkspace(workspaceId);
			setWorkspaceList();
		};
		toggleOpenModal();
		setTitle('Delete');
		setModalContent(<DeleteModal action={deleteWorkspace}></DeleteModal>);
	};
	return (
		<>
			<WorkspaceMenuList>
				<WorkspaceMenuItem onClick={handleRouting}>Open</WorkspaceMenuItem>
				{role === workspaceRole.OWNER && (
					<>
						<WorkspaceMenuItem onClick={openReanmeModal}>Rename</WorkspaceMenuItem>
						<WorkspaceMenuItem onClick={openDeleteModal}>Delete</WorkspaceMenuItem>
					</>
				)}
			</WorkspaceMenuList>
			<Modal width={400} height={200} isOpen={isOpenModal} modalRef={modalRef} title={title} closeModal={closeModal}>
				{modalContent}
			</Modal>
		</>
	);
}

export default WorkspaceMenu;
