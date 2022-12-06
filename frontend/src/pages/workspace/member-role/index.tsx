import { Container, RoleEditMenu } from './index.style';
import userProfile from '@assets/icon/user-profile.svg';
import dropdownIcon from '@assets/icon/dropdown-inactive.svg';
import { convertRole } from '@utils/member-role.utils';
import { MemberRoleProps, Role } from './index.type';
import useModal from '@hooks/useModal';
import { workspaceRole, workspaceRoleArr } from '@data/workspace-role';
import { useRecoilValue } from 'recoil';
import { myInfoInWorkspaceState } from '@context/user';

function MemberRole({ participant, handleRole }: MemberRoleProps) {
	const { modalRef, isOpenModal, toggleOpenModal, closeModal } = useModal();
	const myInfoInWorkspace = useRecoilValue(myInfoInWorkspaceState);

	const handleMemberRole = (role: Role) => {
		handleRole(participant.user.userId, role);
		closeModal();
	};

	return (
		<Container>
			<div className="info">
				<img alt="participant profile" src={userProfile} className="profile" />
				<p className="name">{participant.user.nickname}</p>
			</div>
			<div className="role-setting">
				<p className="role-selected">{convertRole(participant.role)}</p>
				{myInfoInWorkspace.role === workspaceRole.OWNER && (
					<img alt="role dropdown" src={dropdownIcon} className="dropdown" onClick={toggleOpenModal} />
				)}
			</div>

			{isOpenModal && (
				<RoleEditMenu ref={modalRef}>
					{workspaceRoleArr.map((role) => (
						<p key={role.id} className="role" onClick={() => handleMemberRole(role.roleIndex)}>
							{role.roleText}
						</p>
					))}
				</RoleEditMenu>
			)}
		</Container>
	);
}

export default MemberRole;
