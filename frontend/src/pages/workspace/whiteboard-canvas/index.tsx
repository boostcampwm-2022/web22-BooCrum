import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { initGrid, initZoom } from '@utils/fabric.utils';
import { WhiteboardCanvasLayout } from './index.style';
import { useRecoilState } from 'recoil';
import { zoomState } from '@context/workspace';

function WhiteboardCanvas() {
	const canvas = useRef<fabric.Canvas | null>(null);
	const [zoom, setZoom] = useRecoilState(zoomState);

	useEffect(() => {
		if (canvas.current && zoom.event === 'control')
			canvas.current.zoomToPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, zoom.zoom / 100);
	}, [zoom]);

	useEffect(() => {
		canvas.current = initCanvas();
		return () => {
			if (canvas.current) {
				canvas.current.dispose();
				canvas.current = null;
			}
		};
	}, []);

	const initCanvas = () => {
		const grid = 50;
		const canvasWidth = window.innerWidth;
		const canvasHeight = window.innerHeight;

		const fabricCanvas = new fabric.Canvas('canvas', {
			height: canvasHeight,
			width: canvasWidth,
			backgroundColor: '#f1f1f1',
		});

		initGrid(fabricCanvas, canvasWidth, canvasHeight, grid);
		initZoom(fabricCanvas, setZoom);
		return fabricCanvas;
	};

	return (
		<>
			<WhiteboardCanvasLayout>
				<canvas id="canvas"></canvas>
			</WhiteboardCanvasLayout>
		</>
	);
}
export default WhiteboardCanvas;
