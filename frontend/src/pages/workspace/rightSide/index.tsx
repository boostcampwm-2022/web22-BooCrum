import { Container } from './index.style';
import shareIcon from '@assets/icon/share.svg';
import ZoomController from '../zoomController';

function RightSide() {
	return (
		<Container>
			<img alt="share icon" className="share" src={shareIcon} />
			<ZoomController />
		</Container>
	);
}

export default RightSide;
