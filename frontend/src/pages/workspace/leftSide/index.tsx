import { Container } from './index.style';
import exportIcon from '@assets/icon/export.png';

function LeftSide() {
	return (
		<Container>
			<p className="logo">B</p>
			<img alt="export canvas" className="export" src={exportIcon} />
		</Container>
	);
}

export default LeftSide;
