import { Container } from './index.style';
import zoomOut from '@assets/icon/zoom-out.svg';
import zoomIn from '@assets/icon/zoom-in.svg';
import { useRecoilState } from 'recoil';
import { zoomState } from '@context/workspace';
function ZoomController() {
	const [zoom, setZoom] = useRecoilState(zoomState);

	const handleZoomOut = () => {
		setZoom((prevZoom) =>
			prevZoom.zoom - 10 >= 50
				? { zoom: prevZoom.zoom - 10, event: 'control' }
				: { zoom: prevZoom.zoom, event: 'control' }
		);
	};

	const handleZoomIn = () => {
		setZoom((prevZoom) =>
			prevZoom.zoom + 10 <= 200
				? { zoom: prevZoom.zoom + 10, event: 'control' }
				: { zoom: prevZoom.zoom, event: 'control' }
		);
	};

	return (
		<Container>
			<div className="zoom" onClick={handleZoomOut}>
				<img alt="zoom out" className="zoom-icon" src={zoomOut} />
			</div>
			<p className="zoom-percent">{zoom.zoom}%</p>
			<div className="zoom" onClick={handleZoomIn}>
				<img alt="zoom in" className="zoom-icon" src={zoomIn} />
			</div>
		</Container>
	);
}

export default ZoomController;
