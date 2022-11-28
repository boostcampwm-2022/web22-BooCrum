import { useEffect, useState } from 'react';
import { Container, Invite, ParticipantList } from './index.style';
import closeIcon from '@assets/icon/close.svg';
import copyLink from '@assets/icon/copy-link.svg';
import userProfile from '@assets/icon/user-profile.svg';
import { Workspace } from '@api/workspace';
import { ParticipantInfo, ShareModalProps } from './index.type';

function ShareModal({ id, modalRef, closeModal }: ShareModalProps) {
	const [email, setEmail] = useState('');
	const [participant, setParticipant] = useState<ParticipantInfo[]>([]);

	useEffect(() => {
		async function getParticipant() {
			const participant = await Workspace.getWorkspaceParticipant(id);
			setParticipant(participant);
		}

		getParticipant();
	}, []);

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

			<ParticipantList>
				{participant.map((part) => (
					<div key={part.id} className="participant-box">
						<img alt="participant profile" src={userProfile} className="participant-profile" />
						<p className="participant-name">{part.user.nickname}</p>
					</div>
				))}
			</ParticipantList>

			<div className="bottom">
				<img alt="copy workspace url" src={copyLink} className="copy-icon" />
				copy link
			</div>
		</Container>
	);
}

export default ShareModal;
