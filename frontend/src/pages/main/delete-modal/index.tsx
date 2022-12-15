import { DeleteModalLayout } from './index.style';
import { DeleteModalProps } from './index.types';

function DeleteModal({ action }: DeleteModalProps) {
	const handleClickBtn = () => {
		action();
	};
	return (
		<DeleteModalLayout>
			<div>정말 삭제하시겠습니까?</div>
			<button onClick={handleClickBtn}>DELETE</button>
		</DeleteModalLayout>
	);
}

export default DeleteModal;
