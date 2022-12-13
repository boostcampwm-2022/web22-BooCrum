export default () => {
	let canvas: OffscreenCanvas;
	let ctx: OffscreenCanvasRenderingContext2D | null;
	const gridSize = 50;
	let lastPosition: { x: number; y: number } = { x: 0, y: 0 };
	let lastZoom = 1;

	self.onmessage = ({ data }) => {
		if (data.type === 'init') {
			canvas = data.canvas as OffscreenCanvas;

			ctx = canvas.getContext('2d');
			const backgroundColor = '#f1f1f1';
			if (!ctx) return;
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			const defaultCoords = { x: 0, y: 0 };
			drawGrid(gridSize * lastZoom, defaultCoords);
		}

		if (data.type === 'move') {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawGrid(gridSize * lastZoom, data.coords);
		}

		if (data.type === 'zoom') {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			lastZoom = data.zoom;
			drawGrid(gridSize * data.zoom, { x: data.x, y: data.y });
		}

		if (data.type === 'resize') {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.width = data.width;
			canvas.height = data.height;
			drawGrid(gridSize * lastZoom, lastPosition);
		}
	};

	const drawGrid = (gridSize: number, coords: { x: number; y: number }) => {
		lastPosition = coords;
		const offsetX = -1 * (coords.x % gridSize);
		const offsetY = -1 * (coords.y % gridSize);

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
};
