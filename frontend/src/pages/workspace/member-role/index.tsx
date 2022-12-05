import { Container, RoleEditMenu } from './index.style';
import userProfile from '@assets/icon/user-profile.svg';
import dropdownIcon from '@assets/icon/dropdown-inactive.svg';
import { convertRole } from '@utils/member-role.utils';
import { MemberInfoProps, Role } from './index.type';
import useModal from '@hooks/useModal';
import { workspaceRoleArr } from '@data/workspace-role';

function MemberRole({ participant }: MemberInfoProps) {
	const { modalRef, isOpenModal, toggleOpenModal, closeModal } = useModal();

	const handleRole = (role: Role) => {
		console.log(role);
		closeModal();
	};

	return (
		<Container>
			<div className="info">
				<img alt="participant profile" src={userProfile} className="profile" />
				<p className="name">{participant.user.nickname}</p>
			</div>
			<div className="role-setting" onClick={toggleOpenModal}>
				<p className="role-selected">{convertRole(participant.role)}</p>
				<img alt="role dropdown" src={dropdownIcon} className="dropdown" />
			</div>

			{isOpenModal && (
				<RoleEditMenu ref={modalRef}>
					{workspaceRoleArr.map((role) => (
						<p key={role.id} className="role" onClick={() => handleRole(role.roleIndex)}>
							{role.roleText}
						</p>
					))}
				</RoleEditMenu>
			)}
		</Container>
	);
}

export default MemberRole;
