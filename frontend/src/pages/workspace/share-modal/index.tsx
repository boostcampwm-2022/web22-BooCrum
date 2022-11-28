import { RefObject } from 'react';
import { Container } from './index.style';

interface ShareModalProps {
	id: string;
	modalRef: RefObject<HTMLDivElement>;
	closeModal: () => void;
}

function ShareModal({ id, modalRef, closeModal }: ShareModalProps) {
	return <Container ref={modalRef}>share {id}</Container>;
}

export default ShareModal;
