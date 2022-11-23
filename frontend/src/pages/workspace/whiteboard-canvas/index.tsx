import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { drawingGird } from '@utils/fabric.utils';
import { v4 } from 'uuid';

function WhiteboardCanvas() {
	const canvas = useRef<fabric.Canvas | null>(null);
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
		const canvasWidth = 2000;
		const canvasHeight = 900;

		const fabricCanvas = new fabric.Canvas('canvas', {
			height: canvasHeight,
			width: canvasWidth,
			backgroundColor: '#f1f1f1',
		});

		drawingGird(fabricCanvas, canvasWidth, canvasHeight, grid);

		// 이벤트 추가 예시
		fabricCanvas.on('object:added', (e) => {
			console.log(e);
		});

		return fabricCanvas;
	};

	// Object 추가 예시
	const addObj = () => {
		if (!canvas.current) return;
		const rect = new fabric.Rect({
			objectId: v4(),
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
			<button onClick={addObj}>add</button>
			<button onClick={clearObjects}>CLEAR</button>
			<canvas id="canvas"></canvas>
		</>
	);
}
export default WhiteboardCanvas;
