import { Container, UserDetail, UserInfo } from './index.style';
import { useRecoilValue } from 'recoil';
import { membersState } from '@context/workspace';
import { Member } from './index.type';
import { useState } from 'react';
import userIcon from '@assets/icon/user-icon.svg';

function UserList() {
	const members = useRecoilValue(membersState);
	const [selectedMember, setSelectedMember] = useState<Member>({
		userId: '',
		nickname: '',
		color: '',
	});

	const handleDetailUser = (member: Member) => {
		setSelectedMember(member);
	};

	return (
		<>
			<Container>
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
