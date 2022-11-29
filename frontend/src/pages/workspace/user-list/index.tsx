import { Container, UserDetail, UserInfo } from './index.style';
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
				<UserInfo color="#d9d9d9">
					<div className="user-profile" onClick={() => handleDetailUser(user)}>
						<img alt="user profile" className="user-icon" src={userIcon} />
					</div>
					<UserDetail>{selectedMember.nickname}</UserDetail>
				</UserInfo>
				{members.slice(0, 5).map((member) => (
					<UserInfo key={member.userId} color={member.color}>
						<div className="user-profile" onClick={() => handleDetailUser(member)}>
							<img alt="user profile" className="user-icon" src={userIcon} />
						</div>
						<UserDetail>{selectedMember.nickname}</UserDetail>
					</UserInfo>
				))}
			</Container>
		</>
	);
}

export default UserList;
