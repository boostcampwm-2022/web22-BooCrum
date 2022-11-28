import { RefObject, useState } from 'react';
import { Container, Invite } from './index.style';
import closeIcon from '@assets/icon/close.svg';
import copyLink from '@assets/icon/copy-link.svg';

interface ShareModalProps {
	id: string;
	modalRef: RefObject<HTMLDivElement>;
	closeModal: () => void;
}

function ShareModal({ id, modalRef, closeModal }: ShareModalProps) {
	const [email, setEmail] = useState('');

	return (
		<Container ref={modalRef}>
			<div className="header">
				<h1 className="title">Invite</h1>
				<img alt="close modal" src={closeIcon} className="modal-close" onClick={closeModal} />
			</div>

			<Invite isValid={email !== ''}>
				<input className="invite-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<div className="invite-button">send invite</div>
			</Invite>

			<div className="bottom">
				<img alt="copy workspace url" src={copyLink} className="copy-icon" />
				copy link
			</div>
		</Container>
	);
}

export default ShareModal;
