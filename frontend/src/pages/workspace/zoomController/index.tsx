import { Container } from './index.style';
import zoomOut from '@assets/icon/zoom-out.svg';
import zoomIn from '@assets/icon/zoom-in.svg';

function ZoomController() {
	return (
		<Container>
			<div className="zoom">
				<img alt="zoom out" className="zoom-icon" src={zoomOut} />
			</div>
			<p className="zoom-percent">12%</p>
			<div className="zoom">
				<img alt="zoom in" className="zoom-icon" src={zoomIn} />
			</div>
		</Container>
	);
}

export default ZoomController;
