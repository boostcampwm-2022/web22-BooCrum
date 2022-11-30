import { useEffect, useState } from 'react';
import { Container, Invite, ParticipantList } from './index.style';
import copyLink from '@assets/icon/copy-link.svg';
import userProfile from '@assets/icon/user-profile.svg';
import { Workspace } from '@api/workspace';
import { ParticipantInfo, ShareModalProps } from './index.type';
import ToastMessage from '@components/toast-message';

function ShareModal({ id }: ShareModalProps) {
	const [email, setEmail] = useState('');
	const [participant, setParticipant] = useState<ParticipantInfo[]>([]);
	const [openToast, setOpenToast] = useState(false);

	useEffect(() => {
		async function getParticipant() {
			const result = await Workspace.getWorkspaceParticipant(id);
			setParticipant(result);
		}

		getParticipant();
	}, []);

	const handleCopyLink = () => {
		navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/workspace/${id}`);
		setOpenToast(true);

		const timer = setTimeout(() => {
			setOpenToast(false);
			clearTimeout(timer);
		}, 3000);
	};

	return (
		<Container>
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
				<div className="copy-link" onClick={handleCopyLink}>
					<img alt="copy workspace url" src={copyLink} className="copy-icon" />
					copy link
				</div>
			</div>

			{openToast && <ToastMessage message="clipboard에 복사되었습니다!" />}
		</Container>
	);
}

export default ShareModal;
