import { useState } from 'react';
import { RenameModalLayout } from './index.style';
import { RenameModalProps } from './index.types';

function RenameModal({ action, workspaceName }: RenameModalProps) {
	const [newWorkspaceName, setNewWorkspaceName] = useState(workspaceName);
	const handleClickBtn = () => {
		action(newWorkspaceName);
	};
	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setNewWorkspaceName(e.target.value);
	};
	return (
		<RenameModalLayout>
			<input onChange={onChange} type="text" placeholder="File Name..." value={newWorkspaceName}></input>
			<button onClick={handleClickBtn}>RENAME</button>
		</RenameModalLayout>
	);
}

export default RenameModal;
