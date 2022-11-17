import { DeleteModalLayout } from './index.style';
import { DeleteModalProps } from './index.types';

function DeleteModal({ closeModal }: DeleteModalProps) {
	const deleteWorkspace = () => {
		closeModal();
	};

	return (
		<>
			<DeleteModalLayout>
				<h3>Delete</h3>
				<div>정말 삭제하시겠습니까?</div>
				<button onClick={deleteWorkspace}>DELETE</button>
			</DeleteModalLayout>
		</>
	);
}

export default DeleteModal;
