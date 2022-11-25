import { CanvasObject } from '@pages/workspace/whiteboard-canvas/index.types';
import { fabric } from 'fabric';
import { SetterOrUpdater } from 'recoil';
import { v4 } from 'uuid';

export const initGrid = (canvas: fabric.Canvas, width: number, height: number, gridSize: number) => {
	for (let i = -width / gridSize; i <= (2 * width) / gridSize; i++) {
		const lineY = new fabric.Line([i * gridSize, -height, i * gridSize, height * 2], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
		});

		canvas.sendToBack(lineY);
	}
	for (let i = -height / gridSize; i <= (2 * height) / gridSize; i++) {
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

export const initPanning = (canvas: fabric.Canvas) => {
	canvas.on('mouse:down', function (opt) {
		const evt = opt.e;
		if (canvas.moveMode) {
			canvas.isDragging = true;
			canvas.selection = false;
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
		// on mouse up we want to recalculate new interaction
		// for all objects, so we call setViewportTransform
		if (canvas.viewportTransform) canvas.setViewportTransform(canvas.viewportTransform);
		canvas.isDragging = false;
		canvas.selection = true;
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
