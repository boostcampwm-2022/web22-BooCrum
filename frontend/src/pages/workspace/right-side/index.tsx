import { Container } from './index.style';
import shareIcon from '@assets/icon/share.svg';
import ZoomController from '../zoom-controller';
import UserList from '../user-list';

function RightSide() {
	return (
		<Container>
			<UserList />
			<img alt="share icon" className="share" src={shareIcon} />
			<ZoomController />
		</Container>
	);
}

export default RightSide;
