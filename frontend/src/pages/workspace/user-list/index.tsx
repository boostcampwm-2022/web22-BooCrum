import { Container, UserDetail, UserProfile } from './index.style';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { membersState } from '@context/workspace';
import { Member } from './index.type';
import { useEffect, useState } from 'react';
import userIcon from '@assets/icon/user-icon.svg';
import { userProfileState } from '@context/user';

function UserList() {
	const members = useRecoilValue(membersState);
	const userProfileLoadable = useRecoilValueLoadable(userProfileState);
	const [user, setUser] = useState<Member>({
		userId: '',
		nickname: '',
		color: '',
	});
	const [selectedMember, setSelectedMember] = useState<Member>({
		userId: '',
		nickname: '',
		color: '',
	});

	useEffect(() => {
		if (userProfileLoadable.state === 'hasValue') {
			const { userId, nickname } = userProfileLoadable.contents;
			setUser({ userId, nickname, color: '#d9d9d9' });
		}
	}, [userProfileLoadable]);

	const handleDetailUser = (member: Member) => {
		setSelectedMember(member);
	};

	return (
		<>
			<Container>
				<UserProfile color="#d9d9d9" onClick={() => handleDetailUser(user)}>
					<img alt="user profile" className="user-icon" src={userIcon} />
				</UserProfile>
				<UserProfile color="#d9d9d9" onClick={() => handleDetailUser(user)}>
					<img alt="user profile" className="user-icon" src={userIcon} />
				</UserProfile>
				{members.slice(0, 5).map((member) => (
					<UserProfile color={member.color} key={member.userId} onClick={() => handleDetailUser(member)}>
						<img alt="user profile" className="user-icon" src={userIcon} />
					</UserProfile>
				))}
			</Container>

			{selectedMember.userId && <UserDetail>{selectedMember.nickname}</UserDetail>}
		</>
	);
}

export default UserList;
