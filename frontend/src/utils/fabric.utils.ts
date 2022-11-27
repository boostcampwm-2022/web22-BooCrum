import { CanvasObject, MemberInCanvas, UserMousePointer } from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import { SetterOrUpdater } from 'recoil';
import { v4 } from 'uuid';
import { addPostIt, addSection } from './object.utils';

export const initGrid = (canvas: fabric.Canvas, width: number, height: number, gridSize: number) => {
	for (let i = -width / gridSize + 1; i <= (2 * width) / gridSize; i++) {
		const lineY = new fabric.Line([i * gridSize, -height, i * gridSize, height * 2], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
		});

		canvas.sendToBack(lineY);
	}
	for (let i = -height / gridSize + 1; i <= (2 * height) / gridSize; i++) {
		const lineX = new fabric.Line([-width, i * gridSize, width * 2, i * gridSize], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
		});

		canvas.sendToBack(lineX);
	}
};

export const initZoom = (
	canvas: fabric.Canvas,
	setZoom: SetterOrUpdater<{
		percent: number;
		event: string;
	}>
) => {
	canvas.on('mouse:wheel', function (opt) {
		if (opt.e.ctrlKey === false) return;
		const delta = opt.e.deltaY;
		let zoom = canvas.getZoom();
		zoom += -delta / 1000;
		if (zoom > 2) zoom = 2;
		if (zoom < 0.5) zoom = 0.5;
		setZoom({ percent: Math.round(zoom * 100), event: 'wheel' });
		canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
		opt.e.preventDefault();
		opt.e.stopPropagation();
	});
};

export const initDragPanning = (canvas: fabric.Canvas) => {
	canvas.on('mouse:down', function (opt) {
		const evt = opt.e;
		if (canvas.mode === 'move') {
			canvas.defaultCursor = 'grabbing';
			canvas.isDragging = true;
			canvas.lastPosX = evt.clientX;
			canvas.lastPosY = evt.clientY;
		}
	});
	canvas.on('mouse:move', function (opt) {
		if (canvas.viewportTransform && canvas.isDragging) {
			const e = opt.e;
			const vpt = canvas.viewportTransform;

			if (canvas.lastPosX && canvas.lastPosY) {
				vpt[4] += e.clientX - canvas.lastPosX;
				vpt[5] += e.clientY - canvas.lastPosY;
			}
			canvas.requestRenderAll();
			canvas.lastPosX = e.clientX;
			canvas.lastPosY = e.clientY;
		}
	});
	canvas.on('mouse:up', function (opt) {
		if (canvas.viewportTransform) canvas.setViewportTransform(canvas.viewportTransform);

		if (canvas.mode === 'move') {
			canvas.defaultCursor = 'grab';
			canvas.isDragging = false;
		}
	});
};

export const initWheelPanning = (canvas: fabric.Canvas) => {
	canvas.on('mouse:wheel', (opt) => {
		const evt = opt.e;
		if (evt.ctrlKey === true) return;
		const deltaX = evt.deltaX;
		const deltaY = evt.deltaY;
		if (canvas.viewportTransform) {
			const vpt = canvas.viewportTransform;
			vpt[4] += -deltaX / canvas.getZoom();
			vpt[5] += -deltaY / canvas.getZoom();
		}
		canvas.requestRenderAll();
		if (canvas.viewportTransform) canvas.setViewportTransform(canvas.viewportTransform);
	});
};

export const addObject = (canvas: fabric.Canvas) => {
	canvas.on('mouse:down', function (opt) {
		const evt = opt.e;
		const vpt = canvas.viewportTransform;
		if (!vpt) return;
		const x = (evt.clientX - vpt[4]) / vpt[3];
		const y = (evt.clientY - vpt[5]) / vpt[3];
		if (canvas.mode === 'section' && !canvas.getActiveObject()) {
			addSection(canvas, x, y);
		} else if (canvas.mode === 'postit' && !canvas.getActiveObject()) {
			addPostIt(canvas, x, y);
		}
	});
};

export const createObjectFromServer = (canvas: fabric.Canvas, newObject: CanvasObject) => {
	const rect = new fabric.Rect({
		...newObject,
	});

	canvas.add(rect);
};

export const deleteObjectFromServer = (canvas: fabric.Canvas, objectId: string) => {
	canvas.forEachObject((object) => {
		if (object.objectId === objectId) canvas.remove(object);
	});
};

export const moveCursorFromServer = (membersInCanvas: MemberInCanvas[], userMousePointer: UserMousePointer) => {
	const { userId, x, y } = userMousePointer;
	const memberInCanvasById = membersInCanvas.filter((memberInCanvas) => memberInCanvas.userId === userId);
	if (memberInCanvasById.length === 0) return;
	memberInCanvasById[0].cursorObject.set({ top: y, left: x });
};

export const createCursorObject = (color: string) => {
	const cursorObject = new fabric.Path(
		'M10.9231 16.0296C11.0985 16.4505 10.9299 18.0447 10 18.4142C9.07008 18.7837 7.88197 18.4142 7.88197 18.4142L5.72605 14.1024L2 17.8284V1L13.4142 12.4142H9.16151C9.37022 12.8144 10.7003 15.4948 10.9231 16.0296Z'
	);
	cursorObject.set({ fill: color, selectable: false });

	return cursorObject;
};
