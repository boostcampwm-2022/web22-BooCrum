import { Container, UserDetail, UserInfo } from './index.style';
import { useRecoilValue } from 'recoil';
import { membersState } from '@context/workspace';
import userIcon from '@assets/icon/user-icon.svg';

function UserList() {
	const members = useRecoilValue(membersState);

	return (
		<Container>
			{members.slice(0, 5).map((member) => (
				<UserInfo key={member.userId} color={member.color}>
					<div className="user-profile">
						<img alt="user profile" className="user-icon" src={userIcon} />
					</div>
					<UserDetail>{member.nickname}</UserDetail>
				</UserInfo>
			))}
		</Container>
	);
}

export default UserList;
