import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { initGrid, initZoom, setZoomValue } from '@utils/fabric.utils';
import { WhiteboardCanvasLayout } from './index.style';
import { useRecoilState, useRecoilValue } from 'recoil';
import { zoomState } from '@context/workspace';

function WhiteboardCanvas() {
	const canvas = useRef<fabric.Canvas | null>(null);
	const [zoom, setZoom] = useRecoilState(zoomState);

	useEffect(() => {
		if (canvas.current) canvas.current.zoomToPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, zoom / 100);
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

	// Object 추가 예시
	const addObj = () => {
		if (!canvas.current) return;
		const rect = new fabric.Rect({
			height: 280,
			width: 200,
			top: 100,
			left: 100,
			fill: 'yellow',
		});
		canvas.current.add(rect);
	};
	// Object 삭제 예시
	const clearObjects = () => {
		if (!canvas.current) return;
		canvas.current.forEachObject((obj) => {
			// 그리드 제외 하고 삭제
			if (!(obj instanceof fabric.Line)) canvas.current?.remove(obj);
		});
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
