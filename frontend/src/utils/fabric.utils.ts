import { fabric } from 'fabric';
import { SetterOrUpdater } from 'recoil';

export const initGrid = (canvas: fabric.Canvas, width: number, height: number, gridSize: number) => {
	for (let i = -width / gridSize; i <= (2 * width) / gridSize; i++) {
		const lineY = new fabric.Line([i * gridSize, -height, i * gridSize, height * 2], {
			type: 'line',
			stroke: '#ccc',
			selectable: false,
		});

		canvas.sendToBack(lineY);
	}
	for (let i = -height / gridSize; i <= (2 * height) / gridSize; i++) {
		const lineX = new fabric.Line([-width, i * gridSize, width * 2, i * gridSize], {
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
		zoom: number;
		event: string;
	}>
) => {
	canvas.on('mouse:wheel', function (opt) {
		const delta = opt.e.deltaY;
		let zoom = canvas.getZoom();
		zoom += -delta / 1000;
		if (zoom > 2) zoom = 2;
		if (zoom < 0.5) zoom = 0.5;
		setZoom({ zoom: Math.round(zoom * 100), event: 'wheel' });
		canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
		opt.e.preventDefault();
		opt.e.stopPropagation();
	});
};
