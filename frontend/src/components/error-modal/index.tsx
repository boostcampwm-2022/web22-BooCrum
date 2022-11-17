import { ErrorModalProps } from './index.types';
import { ModalContent } from './index.style';
import Modal from '@components/modal';
import ErrorImage from '@assets/image/error-image.png';

function ErrorModal({ isOpen, modalRef, width = 400, height = 200, errorMessage }: ErrorModalProps) {
	return (
		<Modal isOpen={isOpen} modalRef={modalRef} width={width} height={height}>
			<ModalContent>
				<img className="error-image" src={ErrorImage} alt="error-image" />
				<div className="error-message">{errorMessage}</div>
			</ModalContent>
		</Modal>
	);
}

export default ErrorModal;
