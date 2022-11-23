import { Container } from './index.style';
import userProfileImage from '@assets/icon/user-profile.svg';

const users = [
	{
		id: 13,
		role: 2,
		updateDate: '2022-11-21T05:52:22.000Z',
		user: {
			userId: '52180188',
			nickname: 'tori209',
			registerDate: '2022-11-16T07:38:44.000Z',
		},
	},
	{
		id: 12,
		role: 2,
		updateDate: '2022-11-21T05:52:22.000Z',
		user: {
			userId: '52180188',
			nickname: 'tori2',
			registerDate: '2022-11-16T07:38:44.000Z',
		},
	},
];

function UserList() {
	return (
		<Container>
			{users.slice(0, 5).map((user) => (
				<img key={user.id} alt="user profile" className="user-profile" src={userProfileImage} />
			))}
		</Container>
	);
}

export default UserList;
