import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import {
	addObject,
	initDragPanning,
	initWheelPanning,
	initZoom,
	initGrid,
	deleteObject,
	setObjectIndexLeveling,
	setCursorMode,
	initDrawing,
	canvasResize,
	setObejctProps,
} from '@utils/fabric.utils';
import { toolItems } from '@data/workspace-tool';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cursorState, zoomState } from '@context/workspace';
import { CanvasType } from './types';
import { myInfoInWorkspaceState, userProfileState } from '@context/user';
import { workspaceRole } from '@data/workspace-role';

function useCanvas() {
	const canvas = useRef<fabric.Canvas | null>(null);
	const [zoom, setZoom] = useRecoilState(zoomState);
	const [cursor, setCursor] = useRecoilState(cursorState);
	const myInfoInWorkspace = useRecoilValue(myInfoInWorkspaceState);
	const userProfile = useRecoilValue(userProfileState);

	useEffect(() => {
		if (canvas.current && zoom.event === 'control') {
			canvas.current.zoomToPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, zoom.percent / 100);
			canvas.current.requestRenderAll();
		}
	}, [zoom]);

	useEffect(() => {
		canvas.current = initCanvas();
		window.addEventListener('resize', canvasResizeThrottler);

		return () => {
			if (canvas.current) {
				canvas.current.dispose();
				canvas.current = null;
				window.removeEventListener('resize', canvasResizeThrottler);
			}
		};
	}, []);

	useEffect(() => {
		if (!canvas.current) return;

		const fabricCanvas = canvas.current as fabric.Canvas;
		fabricCanvas.isDrawingMode = false;
		if (myInfoInWorkspace.role === workspaceRole.GUEST) {
			setCursorMode(fabricCanvas, 'grab', CanvasType.move, false);
		} else {
			if (cursor.type === toolItems.SECTION) {
				setCursorMode(fabricCanvas, 'context-menu', CanvasType.section, false);
				canvas.current.skipTargetFind = true;
			} else if (cursor.type === toolItems.POST_IT) {
				setCursorMode(fabricCanvas, 'context-menu', CanvasType.postit, false);
				canvas.current.skipTargetFind = true;
			} else if (cursor.type === toolItems.MOVE) {
				setCursorMode(fabricCanvas, 'grab', CanvasType.move, false);
				canvas.current.skipTargetFind = true;
			} else if (cursor.type === toolItems.SELECT) {
				setCursorMode(fabricCanvas, 'default', CanvasType.select, true);
				canvas.current.skipTargetFind = false;
			} else if (cursor.type === toolItems.PEN) {
				setCursorMode(fabricCanvas, 'default', CanvasType.draw, true);
				fabricCanvas.isDrawingMode = true;
				fabricCanvas.freeDrawingBrush.color = cursor.color;
				canvas.current.skipTargetFind = true;
			} else if (cursor.type === toolItems.ERASER) {
				// todo canvas.mode에 erase 추가해줘야함
				setCursorMode(fabricCanvas, 'default', CanvasType.erase, false);
				canvas.current.skipTargetFind = false;
			}
			canvas.current.discardActiveObject();
			canvas.current.requestRenderAll();
		}
	}, [cursor, myInfoInWorkspace]);

	const canvasResizeThrottler = () => {
		let timer = null;
		if (!timer) {
			timer = setTimeout(() => {
				timer = null;
				canvasResize(canvas.current as fabric.Canvas);
			}, 100);
		}
	};

	const initCanvas = () => {
		const grid = 50;
		const pattern = 100;
		const canvasWidth = window.innerWidth;
		const canvasHeight = window.innerHeight;

		const fabricCanvas = new fabric.Canvas('canvas', {
			mode: CanvasType.select,
			height: canvasHeight,
			width: canvasWidth,
			backgroundColor: '#f1f1f1',
			renderOnAddRemove: false,
		});

		initGrid(fabricCanvas, pattern, grid);
		initDrawing(fabricCanvas);
		initZoom(fabricCanvas, setZoom);
		initDragPanning(fabricCanvas);
		initWheelPanning(fabricCanvas);
		addObject(fabricCanvas, userProfile.nickname, setCursor);
		deleteObject(fabricCanvas);
		setObejctProps(fabricCanvas);
		setObjectIndexLeveling(fabricCanvas);

		return fabricCanvas;
	};

	return {
		canvas,
	};
}

export default useCanvas;
