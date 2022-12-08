import { colorChips } from '@data/workspace-object-color';
import { ObjectType, CanvasType, SocketObjectType } from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import { SetterOrUpdater } from 'recoil';
import { v4 } from 'uuid';
import { addPostIt, addSection } from './object.utils';
import { toolItems } from '@data/workspace-tool';

export const canvasResize = (canvas: fabric.Canvas) => {
	canvas.setDimensions({ width: window.innerWidth, height: window.innerHeight });
};

export const initGrid = (canvas: fabric.Canvas, patternSize: number, gridSize: number) => {
	const backgroundCanvas = new fabric.StaticCanvas(null, {
		mode: canvas.mode,
		height: patternSize,
		width: patternSize,
		backgroundColor: '#f1f1f1',
	});

	for (let i = 0; i <= patternSize / gridSize; i++) {
		const lineY = new fabric.Line([i * gridSize, 0, i * gridSize, patternSize], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
			isSocketObject: false,
		});

		backgroundCanvas.add(lineY);
	}
	for (let i = 0; i <= patternSize / gridSize; i++) {
		const lineX = new fabric.Line([0, i * gridSize, patternSize, i * gridSize], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
			isSocketObject: false,
		});

		backgroundCanvas.add(lineX);
	}

	const backgroundPattern = new fabric.Pattern({
		source: backgroundCanvas.toDataURL(),
	});

	canvas.setBackgroundColor(backgroundPattern, () => canvas.renderAll());
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

export const initDrawing = (canvas: fabric.Canvas) => {
	canvas.freeDrawingBrush.width = 5;
	canvas.on('object:added', (e) => {
		if (!(e.target instanceof fabric.Path) || e.target.type === ObjectType.cursor) return;
		const path = e.target;
		path.set({ perPixelTargetFind: true, lockRotation: true });
		path.on('mousedown', () => {
			if (canvas.mode !== CanvasType.erase || path.type !== ObjectType.draw) return;
			path.isSocketObject = false;
			canvas.remove(path);
		});
	});
};

export const addObject = (
	canvas: fabric.Canvas,
	creator: string,
	setCursor: SetterOrUpdater<{
		type: number;
		x: number;
		y: number;
		color: string;
	}>
) => {
	//todo 색 정보 받아와야함
	canvas.on('mouse:down', function (opt) {
		const evt = opt.e;
		const vpt = canvas.viewportTransform;
		if (!vpt) return;
		const x = (evt.clientX - vpt[4]) / vpt[3];
		const y = (evt.clientY - vpt[5]) / vpt[3];
		if (canvas.mode === CanvasType.section && !canvas.getActiveObject()) {
			addSection(canvas, x, y, colorChips[3]);
			setCursor((prev) => {
				return { ...prev, type: toolItems.SELECT };
			});
		} else if (canvas.mode === CanvasType.postit && !canvas.getActiveObject()) {
			addPostIt(canvas, x, y, 40, colorChips[6], creator);
			setCursor((prev) => {
				return { ...prev, type: toolItems.SELECT };
			});
		}
	});
};

export const deleteObject = (canvas: fabric.Canvas) => {
	const objectDeleteHandler = (e: KeyboardEvent) => {
		if (e.key === 'Backspace') {
			if (canvas.mode === 'edit') return;
			canvas.getActiveObjects().forEach((obj) => {
				obj.isSocketObject = false;
				canvas.remove(obj);
			});
			canvas.discardActiveObject();
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

		const drawings = canvas._objects.filter((obj) => obj.type === ObjectType.draw);
		drawings.forEach((obj) => {
			obj.bringToFront();
		});
	});
};

export const setCursorMode = (canvas: fabric.Canvas, cursor: string, mode: CanvasType, selectable: boolean) => {
	canvas.defaultCursor = cursor;
	canvas.hoverCursor = cursor;
	canvas.mode = mode;
	canvas.selection = selectable;
	canvas.forEachObject((obj) =>
		obj.type === ObjectType.cursor ? (obj.selectable = false) : (obj.selectable = selectable)
	);
};

export const toStringPath = (path: fabric.Path) => {
	const reg = /(?<=d=\")[^\"]*(?=\")/g;
	const pathString = path.toSVG().match(reg);
	return pathString ? pathString[0] : '';
};

export const calcCanvasFullWidthAndHeight = (canvas: fabric.Canvas) => {
	const coords: { left?: number; right?: number; top?: number; bottom?: number } = {
		left: undefined,
		right: undefined,
		top: undefined,
		bottom: undefined,
	};
	canvas._objects.forEach((object) => {
		if (object.type in SocketObjectType && object.aCoords) {
			const {
				tl: { x: left, y: top },
				br: { x: right, y: bottom },
			} = object.aCoords;

			if (coords.left === undefined || coords.left > left) {
				coords.left = left;
			}
			if (coords.right === undefined || coords.right < right) {
				coords.right = right;
			}
			if (coords.top === undefined || coords.top > top) {
				coords.top = top;
			}
			if (coords.bottom === undefined || coords.bottom < bottom) {
				coords.bottom = bottom;
			}
		}
	});
	return coords;
};

export const createThumbnailImage = (canvas: fabric.Canvas) => {
	const coords = calcCanvasFullWidthAndHeight(canvas);
	let dataUrl;
	if (!coords.left || !coords.right || !coords.top || !coords.bottom) {
		dataUrl = canvas.toDataURL({ quality: 0.1, format: 'jpeg' });
	} else {
		dataUrl = canvas.toDataURL({
			left: coords.left - 20,
			top: coords.top - 20,
			width: coords.right - coords.left + 40,
			height: coords.bottom - coords.top + 40,
			quality: 0.1,
			format: 'jpeg',
		});
	}

	return dataUrlToFile(dataUrl, 'thumbnail');
};

export const dataUrlToFile = (dataUrl: string, fileName: string) => {
	const arr = dataUrl.split(',');

	const blobBin = atob(arr[1]);
	const array = [];

	for (let i = 0; i < blobBin.length; i++) {
		array.push(blobBin.charCodeAt(i));
	}

	const file = new File([new Uint8Array(array)], fileName, { type: 'image/jpeg' });
	return file;
};
