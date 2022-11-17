import { ModalBackground, ModalLayout } from './index.style';
import { ModalProps } from './index.types';

function Modal({ isOpen, modalRef, width = 400, height = 200, children }: ModalProps) {
	if (!isOpen) return <></>;
	return (
		<>
			<ModalLayout width={width} height={height} ref={modalRef}>
				{children}
			</ModalLayout>
			<ModalBackground></ModalBackground>
		</>
	);
}

export default Modal;
