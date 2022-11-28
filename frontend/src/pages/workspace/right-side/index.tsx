import { Container } from './index.style';
import shareIcon from '@assets/icon/share.svg';
import ZoomController from '../zoom-controller';
import UserList from '../user-list';

interface RightSideProps {
	openShareModal: () => void;
}

function RightSide({ openShareModal }: RightSideProps) {
	return (
		<Container>
			<UserList />
			<img onClick={openShareModal} alt="share icon" className="share" src={shareIcon} />
			<ZoomController />
		</Container>
	);
}

export default RightSide;
