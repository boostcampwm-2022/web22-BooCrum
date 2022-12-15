import { Container } from './index.style';
import exportIcon from '@assets/icon/export.png';
import { useNavigate } from 'react-router-dom';

function LeftSide() {
	const navigate = useNavigate();

	const handleClickExportButton = () => {
		const customEvent = new CustomEvent('export:open');
		document.dispatchEvent(customEvent);
	};

	return (
		<Container>
			<p className="logo" onClick={() => navigate('/')}>
				B
			</p>
			<img onClick={handleClickExportButton} alt="export canvas" className="export" src={exportIcon} />
		</Container>
	);
}

export default LeftSide;
