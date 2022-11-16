import { ModalBackground, ModalLayout } from './index.style';

function Modal({ isOpen, modalRef, children }: ModalProps) {
	if (!isOpen) return <></>;
	return (
		<>
			<ModalLayout ref={modalRef}>{children}</ModalLayout>
			<ModalBackground></ModalBackground>
		</>
	);
}

export default Modal;
