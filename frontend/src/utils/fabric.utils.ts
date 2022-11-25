import { CanvasObject } from '@pages/workspace/whiteboard-canvas/index.types';
import { fabric } from 'fabric';
import { SetterOrUpdater } from 'recoil';
import { addPostIt, addSection } from './object.utils';

<<<<<<< HEAD
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

=======
>>>>>>> 601262f (chore: fe - grabbing cursor 추가 #105)
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
		} else if (canvas.mode === 'section' && !canvas.getActiveObject()) {
			addSection(canvas, evt.clientX, evt.clientY);
		} else if (canvas.mode === 'postit' && !canvas.getActiveObject()) {
			addPostIt(canvas, evt.clientX, evt.clientY);
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
