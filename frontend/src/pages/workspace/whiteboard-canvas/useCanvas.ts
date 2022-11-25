import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { initObject, initDragPanning, initWheelPanning, initZoom } from '@utils/fabric.utils';
import { toolItems } from '@data/workspace-tool';
import { v4 } from 'uuid';
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

	const initCanvas = () => {
		const canvasWidth = window.innerWidth;
		const canvasHeight = window.innerHeight;

		const fabricCanvas = new fabric.Canvas('canvas', {
			height: canvasHeight,
			width: canvasWidth,
			backgroundColor: '#f1f1f1',
		});

		initZoom(fabricCanvas, setZoom);
		initDragPanning(fabricCanvas);
		initWheelPanning(fabricCanvas);
		initObject(fabricCanvas);

		return fabricCanvas;
	};

	return {
		canvas,
	};
}

export default useCanvas;
