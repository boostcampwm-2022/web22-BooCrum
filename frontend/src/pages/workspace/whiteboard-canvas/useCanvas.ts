import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { initGrid, initDragPanning, initWheelPanning, initZoom } from '@utils/fabric.utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cursorState, zoomState } from '@context/workspace';
import { toolItems } from '@data/workspace-tool';
import { v4 } from 'uuid';

function useCanvas() {
	const canvas = useRef<fabric.Canvas | null>(null);
	const [zoom, setZoom] = useRecoilState(zoomState);
	const cursor = useRecoilValue(cursorState);
	useEffect(() => {
		if (cursor.type === toolItems.MOVE) {
			if (canvas.current) {
				canvas.current.moveMode = true;
			}
		} else {
			if (canvas.current) {
				canvas.current.moveMode = false;
			}
		}
	}, [cursor]);

	useEffect(() => {
		if (canvas.current && zoom.event === 'control')
			canvas.current.zoomToPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, zoom.percent / 100);
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
		initDragPanning(fabricCanvas);
		initWheelPanning(fabricCanvas);

		fabricCanvas.add(
			new fabric.Rect({
				objectId: v4(),
				width: 200,
				height: 200,
				fill: 'red',
			})
		);

		return fabricCanvas;
	};

	return {
		canvas,
	};
}

export default useCanvas;
