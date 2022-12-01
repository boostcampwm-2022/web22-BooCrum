import { colorChips } from '@data/workspace-object-color';
import { ObjectType, CanvasType } from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import { SetterOrUpdater } from 'recoil';
import { v4 } from 'uuid';
import { addPostIt, addSection } from './object.utils';

export const initGrid = (canvas: fabric.Canvas, width: number, height: number, gridSize: number) => {
	const backgroundCanvas = new fabric.Canvas('', {
		mode: canvas.mode,
		height: height * 4,
		width: width * 4,
		backgroundColor: '#f1f1f1',
	});
	for (let i = 0; i <= (4 * width) / gridSize; i++) {
		const lineY = new fabric.Line([i * gridSize, 0, i * gridSize, height * 4], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
			isSocketObject: false,
		});

		backgroundCanvas.add(lineY);
	}
	for (let i = 0; i <= (4 * height) / gridSize; i++) {
		const lineX = new fabric.Line([0, i * gridSize, width * 4, i * gridSize], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
			isSocketObject: false,
		});

		backgroundCanvas.add(lineX);
	}

	fabric.Image.fromURL(backgroundCanvas.toDataURL(), (img) => {
		canvas.setBackgroundImage(img, () => canvas.renderAll.bind(canvas), {
			objectId: v4(),
			type: ObjectType.line,
			left: -width,
			top: -height,
			isSocketObject: false,
		});
	});
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
		if (canvas.mode === CanvasType.move) {
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

		if (canvas.mode === CanvasType.move) {
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

export const addObject = (canvas: fabric.Canvas, creator: string) => {
	//todo 색 정보 받아와야함
	canvas.on('mouse:down', function (opt) {
		const evt = opt.e;
		const vpt = canvas.viewportTransform;
		if (!vpt) return;
		const x = (evt.clientX - vpt[4]) / vpt[3];
		const y = (evt.clientY - vpt[5]) / vpt[3];
		if (canvas.mode === CanvasType.section && !canvas.getActiveObject()) {
			addSection(canvas, x, y, colorChips[8]);
		} else if (canvas.mode === CanvasType.postit && !canvas.getActiveObject()) {
			//todo 색 정보 받아와야함
			addPostIt(canvas, x, y, 40, colorChips[0], creator);
		}
	});
};

export const deleteObject = (canvas: fabric.Canvas) => {
	const objectDeleteHandler = (e: KeyboardEvent) => {
		console.log(e.key);
		if (e.key === 'Backspace') {
			if (canvas.mode === 'edit') return;
			canvas.getActiveObjects().forEach((obj) => {
				obj.isSocketObject = false;
				canvas.remove(obj);
			});
			document.removeEventListener('keydown', objectDeleteHandler);
		}
	};

	// object 선택시 이벤트 추가
	canvas.on('selection:created', () => {
		document.addEventListener('keydown', objectDeleteHandler);
	});
};

export const setObjectIndexLeveling = (canvas: fabric.Canvas) => {
	canvas.on('object:added', (e) => {
		const postits = canvas._objects.filter((obj) => obj.type === ObjectType.postit);

		postits.forEach((obj) => {
			obj.bringToFront();
		});
	});
};

export const setCursorMode = (canvas: fabric.Canvas, cursor: string, mode: CanvasType, selectable: boolean) => {
	canvas.defaultCursor = cursor;
	canvas.hoverCursor = cursor;
	canvas.mode = mode;
	canvas.forEachObject((obj) => (obj.selectable = selectable));
};
