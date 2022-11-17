import { DeleteModalLayout } from './index.style';
import { DeleteModalProps } from './index.types';

function DeleteModal({ toggle }: DeleteModalProps) {
	const deleteWorkspace = () => {
		toggle();
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
