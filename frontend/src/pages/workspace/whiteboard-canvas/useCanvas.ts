import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { addObject, initDragPanning, initWheelPanning, initZoom, initGrid } from '@utils/fabric.utils';
import { toolItems } from '@data/workspace-tool';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cursorState, zoomState } from '@context/workspace';

function useCanvas() {
	const canvas = useRef<fabric.Canvas | null>(null);
	const [zoom, setZoom] = useRecoilState(zoomState);
	const cursor = useRecoilValue(cursorState);

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

	useEffect(() => {
		if (!canvas.current) return;

		const fabricCanvas = canvas.current as fabric.Canvas;
		if (cursor.type === toolItems.SECTION || cursor.type === toolItems.POST_IT) {
			fabricCanvas.defaultCursor = 'context-menu';
			fabricCanvas.selection = true;
			if (cursor.type === toolItems.SECTION) fabricCanvas.mode = 'section';
			else fabricCanvas.mode = 'postit';
		} else if (cursor.type === toolItems.MOVE) {
			fabricCanvas.defaultCursor = 'grab';
			fabricCanvas.mode = 'move';
			fabricCanvas.selection = false;
		} else if (cursor.type === toolItems.SELECT) {
			fabricCanvas.defaultCursor = 'default';
			fabricCanvas.mode = 'select';
			fabricCanvas.selection = true;
		} else {
			fabricCanvas.defaultCursor = 'default';
			fabricCanvas.mode = 'draw';
		}
	}, [cursor]);

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
		addObject(fabricCanvas);

		return fabricCanvas;
	};

	return {
		canvas,
	};
}

export default useCanvas;
