import { ModalBackground } from './index.style';
import { ModalProps } from './index.types';
import closeIcon from '@assets/icon/close.svg';

function Modal({ isOpen, closeModal, modalRef, width, height, title, children }: ModalProps) {
	if (!isOpen) return <></>;
	return (
		<ModalBackground width={width} height={height}>
			<div className="modal-layout" ref={modalRef}>
				<div className="header">
					<h1 className="title">{title}</h1>
					<img alt="close modal" src={closeIcon} className="modal-close" onClick={closeModal} />
				</div>

				{children}
			</div>
		</ModalBackground>
	);
}

export default Modal;
