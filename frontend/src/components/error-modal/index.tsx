import { ModalContent } from './index.style';
import ErrorImage from '@assets/image/error-image.png';
import useModal from '@hooks/useModal';
import Modal from '@components/modal';

interface ErrorModalProps {
	errorMessage: string;
}

function ErrorModal({ errorMessage }: ErrorModalProps) {
	const { isOpenModal, modalRef, closeModal } = useModal();

	return (
		<Modal isOpen={isOpenModal} modalRef={modalRef} width={600} height={450} closeModal={closeModal} title="Error">
			<ModalContent>
				<img className="error-image" src={ErrorImage} alt="error-image" />
				<div className="error-message">{errorMessage}</div>
			</ModalContent>
		</Modal>
	);
}

export default ErrorModal;
