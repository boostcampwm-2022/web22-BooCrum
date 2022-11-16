import { RenameModalLayout } from './rename-modal.style';

function RenameModal({ closeModal, workspaceName }: RenameModalProps) {
	const modifyWorkspaceName = () => {
		closeModal();
	};
	return (
		<>
			<RenameModalLayout>
				<h3>Rename</h3>
				<input type="text" placeholder="File Name..." defaultValue={workspaceName}></input>
				<button onClick={modifyWorkspaceName}>RENAME</button>
			</RenameModalLayout>
		</>
	);
}

export default RenameModal;
