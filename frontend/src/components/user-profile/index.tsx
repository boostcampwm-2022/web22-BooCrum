import { Wrapper, ProfileContainer, ProfileItem } from './index.style';
import userProfileIcon from '@assets/icon/user-profile.svg';
import logoutIcon from '@assets/icon/logout.svg';
import useContextMenu from '@hooks/useContextMenu';

function UserProfile() {
	const { isOpen, menuRef, openContextMenu } = useContextMenu();

	return (
		<Wrapper onClick={openContextMenu}>
			<img className="user-profile" alt="user-profile" src={userProfileIcon} />
			<ProfileContainer ref={menuRef} isShow={isOpen}>
				<ProfileItem>
					<img src={userProfileIcon} className="icon" alt="profile-icon" />
					<div className="text">example@example.com</div>
				</ProfileItem>
				<ProfileItem>
					<img src={logoutIcon} className="icon" alt="logout-icon" />
					<div className="text">Log out</div>
				</ProfileItem>
			</ProfileContainer>
		</Wrapper>
	);
}

export default UserProfile;
