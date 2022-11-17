import { useEffect, useState } from 'react';
import { Wrapper, ProfileContainer, ProfileItem } from './index.style';
import userProfileIcon from '@assets/icon/user-profile.svg';
import logoutIcon from '@assets/icon/logout.svg';
import useContextMenu from '@hooks/useContextMenu';
import axios from 'axios';

async function fetchMockUser(): Promise<{ nickname: string }> {
	const result = await axios.get('https://7f09d24e-a8d4-4e68-a7c5-ec8c6da7ef40.mock.pstmn.io/user/info/profile');
	return result.data;
}

function UserProfile() {
	const [nickName, setNickName] = useState<string>('');

	const { isOpen, menuRef, openContextMenu } = useContextMenu();

	useEffect(() => {
		async function setUserData() {
			const { nickname } = await fetchMockUser();
			setNickName(nickname);
		}
		setUserData();
	}, []);

	return (
		<Wrapper onClick={openContextMenu}>
			<img className="user-profile" alt="user-profile" src={userProfileIcon} />
			<ProfileContainer ref={menuRef} isShow={isOpen}>
				<ProfileItem>
					<img src={userProfileIcon} className="icon" alt="profile-icon" />
					<div className="text">{nickName}</div>
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
