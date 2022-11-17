import alarm from '@assets/icon/alarm.svg';
import UserProfile from '@components/user-profile';
import { Container } from './index.style';

function Header() {
	return (
		<Container>
			<img className="alarm-icon" alt="alarm icon" src={alarm} />
			<UserProfile />
		</Container>
	);
}

export default Header;
