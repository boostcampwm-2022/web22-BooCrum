import alarm from '@assets/icon/alarm.svg';
import { Container } from './index.style';

function Header() {
	return (
		<Container>
			<img className="alarm-icon" alt="alarm icon" src={alarm} />
		</Container>
	);
}

export default Header;
