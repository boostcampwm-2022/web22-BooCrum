import { RenameModalLayout } from './index.style';
import { RenameModalProps } from './index.types';

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
