import { Position, CanvasSize } from '@pages/workspace/whiteboard-canvas/types/offscreencanvas.types';

interface OffcanvasWorkerMessageData {
	type: string;
}

interface OffcanvasWorkerInitData extends OffcanvasWorkerMessageData {
	canvas: OffscreenCanvas;
}
interface OffcanvasWorkerZoomData extends OffcanvasWorkerMessageData {
	zoom: number;
	position: Position;
}
interface OffcanvasWorkerMoveData extends OffcanvasWorkerMessageData {
	position: Position;
}
interface OffcanvasWorkerResizeData extends OffcanvasWorkerMessageData {
	size: CanvasSize;
}

export default () => {
	let canvas: OffscreenCanvas;
	let ctx: OffscreenCanvasRenderingContext2D | null;
	const gridSize = 50;
	let lastPosition: Position = { x: 0, y: 0 };
	let lastZoom = 1;

	self.onmessage = ({
		data,
	}: {
		data: OffcanvasWorkerInitData | OffcanvasWorkerMoveData | OffcanvasWorkerZoomData | OffcanvasWorkerResizeData;
	}) => {
		if (data.type === 'init') {
			data = data as OffcanvasWorkerInitData;
			canvas = data.canvas;
			ctx = canvas.getContext('2d');

			initCanvas();
			drawGrid(gridSize * lastZoom, lastPosition);
			return;
		}

		if (data.type === 'move') {
			data = data as OffcanvasWorkerMoveData;
			if (!ctx) return;
			clearCanvas();
			drawGrid(gridSize * lastZoom, data.position);
			return;
		}

		if (data.type === 'zoom') {
			if (!ctx) return;
			clearCanvas();
			lastZoom = (data as OffcanvasWorkerZoomData).zoom;
			drawGrid(gridSize * (data as OffcanvasWorkerZoomData).zoom, (data as OffcanvasWorkerZoomData).position);
			return;
		}

		if (data.type === 'resize') {
			if (!ctx) return;
			data = data as OffcanvasWorkerResizeData;
			clearCanvas();
			resizeCanvas(data.size);
			drawGrid(gridSize * lastZoom, lastPosition);
			return;
		}
	};

	const drawGrid = (gridSize: number, position: Position) => {
		lastPosition = position;
		const offsetX = -1 * (position.x % gridSize);
		const offsetY = -1 * (position.y % gridSize);

		if (!ctx) return;
		ctx.beginPath();
		for (let i = 0; i <= canvas.width / gridSize; i++) {
			const point = i * gridSize - offsetX;
			if (point <= 0) continue;
			ctx.moveTo(point, 0);
			ctx.lineTo(point, canvas.height);
		}

		for (let i = 0; i <= canvas.height / gridSize; i++) {
			const point = i * gridSize - offsetY;
			ctx.moveTo(0, point);
			ctx.lineTo(canvas.width, point);
		}

		ctx.closePath();
		ctx.strokeStyle = '#ccc';
		ctx.stroke();
	};

	const initCanvas = () => {
		if (!ctx) return;
		const backgroundColor = '#f1f1f1';
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	const clearCanvas = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	const resizeCanvas = (size: CanvasSize) => {
		canvas.width = size.width;
		canvas.height = size.height;
	};
};
