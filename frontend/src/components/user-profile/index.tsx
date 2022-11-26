import { useEffect, useState } from 'react';
import { Wrapper, ProfileContainer, ProfileItem } from './index.style';
import userProfileIcon from '@assets/icon/user-profile.svg';
import logoutIcon from '@assets/icon/logout.svg';
import useContextMenu from '@hooks/useContextMenu';
import useAuth from '@hooks/useAuth';
import { User } from '@api/user';
import { useRecoilValueLoadable } from 'recoil';
import { userProfileState } from '@context/user';

function UserProfile() {
	const userProfileLoadable = useRecoilValueLoadable(userProfileState);
	const [nickName, setNickName] = useState<string>('');
	const { logout } = useAuth();

	const { isOpen, menuRef, openContextMenu } = useContextMenu();

	useEffect(() => {
		if (userProfileLoadable.state === 'hasValue') {
			const { nickname } = userProfileLoadable.contents;
			setNickName(nickname);
		}
	}, [userProfileLoadable]);

	return (
		<Wrapper onClick={openContextMenu}>
			<img className="user-profile" alt="user-profile" src={userProfileIcon} />
			<ProfileContainer ref={menuRef} isShow={isOpen}>
				<ProfileItem>
					<img src={userProfileIcon} className="icon" alt="profile-icon" />
					<div className="text">{nickName}</div>
				</ProfileItem>
				<ProfileItem onClick={logout}>
					<img src={logoutIcon} className="icon" alt="logout-icon" />
					<div className="text">Log out</div>
				</ProfileItem>
			</ProfileContainer>
		</Wrapper>
	);
}

export default UserProfile;
