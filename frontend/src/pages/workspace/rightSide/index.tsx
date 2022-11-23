import { Container } from './index.style';
import shareIcon from '@assets/icon/share.svg';
import ZoomController from '../zoomController';
import UserList from '../userList';

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
