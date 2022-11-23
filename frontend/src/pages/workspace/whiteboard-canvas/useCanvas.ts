import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { drawingGird } from '@utils/fabric.utils';

function useCanvas() {
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

	return {
		canvas,
	};
}

export default useCanvas;
