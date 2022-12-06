import { useEffect, useState } from 'react';
import { Container, ParticipantList } from './index.style';
import copyLink from '@assets/icon/copy-link.svg';
import { Workspace } from '@api/workspace';
import { ParticipantInfo, Role, RoleChangeEvent, ShareModalProps } from './index.type';
import ToastMessage from '@components/toast-message';
import MemberRole from '../member-role';
import { useRecoilState } from 'recoil';
import { workspaceParticipantsState } from '@context/workspace';

function ShareModal({ id }: ShareModalProps) {
	const [participants, setParticipants] = useRecoilState<ParticipantInfo[]>(workspaceParticipantsState);
	const [openToast, setOpenToast] = useState(false);

	useEffect(() => {
		async function getParticipant() {
			const result = await Workspace.getWorkspaceParticipant(id);
			setParticipants(result);
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

	const handleRole = (userId: string, role: Role) => {
		const roleChangeEvent = new CustomEvent<RoleChangeEvent>('role:changed', { detail: { userId, role } });
		document.dispatchEvent(roleChangeEvent);
	};

	return (
		<Container>
			<ParticipantList>
				{participants.map((part) => (
					<MemberRole key={part.id} participant={part} handleRole={handleRole} />
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
