import { Container } from './index.style';
import zoomOut from '@assets/icon/zoom-out.svg';
import zoomIn from '@assets/icon/zoom-in.svg';
import { useRecoilState } from 'recoil';
import { zoomState } from '@context/workspace';
function ZoomController() {
	const [zoom, setZoom] = useRecoilState(zoomState);

	const handleZoomOut = () => {
		setZoom((prevZoom) =>
			prevZoom.percent - 10 >= 50
				? { percent: prevZoom.percent - 10, event: 'control' }
				: { percent: prevZoom.percent, event: 'control' }
		);
	};

	const handleZoomIn = () => {
		setZoom((prevZoom) =>
			prevZoom.percent + 10 <= 200
				? { percent: prevZoom.percent + 10, event: 'control' }
				: { percent: prevZoom.percent, event: 'control' }
		);
	};

	return (
		<Container>
			<div className="zoom" onClick={handleZoomOut}>
				<img alt="zoom out" className="zoom-icon" src={zoomOut} />
			</div>
			<p className="zoom-percent">{zoom.percent}%</p>
			<div className="zoom" onClick={handleZoomIn}>
				<img alt="zoom in" className="zoom-icon" src={zoomIn} />
			</div>
		</Container>
	);
}

export default ZoomController;
