import { Container } from './index.style';
import zoomOut from '@assets/icon/zoom-out.svg';
import zoomIn from '@assets/icon/zoom-in.svg';
import { useRecoilState } from 'recoil';
import { zoomState } from '@context/workspace';
function ZoomController() {
	const [zoom, setZoom] = useRecoilState(zoomState);

	const handleZoomOut = () => {
		setZoom((prevZoom) => (prevZoom - 10 > 40 ? prevZoom - 10 : prevZoom));
	};

	const handleZoomIn = () => {
		setZoom((prevZoom) => (prevZoom + 10 <= 200 ? prevZoom + 10 : prevZoom));
	};

	return (
		<Container>
			<div className="zoom" onClick={handleZoomOut}>
				<img alt="zoom out" className="zoom-icon" src={zoomOut} />
			</div>
			<p className="zoom-percent">{zoom}%</p>
			<div className="zoom" onClick={handleZoomIn}>
				<img alt="zoom in" className="zoom-icon" src={zoomIn} />
			</div>
		</Container>
	);
}

export default ZoomController;
