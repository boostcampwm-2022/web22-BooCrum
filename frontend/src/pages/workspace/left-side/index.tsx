import { Container } from './index.style';
import exportIcon from '@assets/icon/export.png';
import { useNavigate } from 'react-router-dom';

function LeftSide() {
	const navigate = useNavigate();

	return (
		<Container>
			<p className="logo" onClick={() => navigate('/')}>
				B
			</p>
			<img alt="export canvas" className="export" src={exportIcon} />
		</Container>
	);
}

export default LeftSide;
