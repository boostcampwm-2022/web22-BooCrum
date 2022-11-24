import { fabric } from 'fabric';

export const drawingGird = (canvas: fabric.Canvas, width: number, height: number, gridSize: number) => {
	for (let i = 0; i < width / gridSize; i++) {
		const lineY = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
			type: 'line',
			stroke: '#ccc',
			selectable: false,
		});
		const lineX = new fabric.Line([0, i * gridSize, width, i * gridSize], {
			type: 'line',
			stroke: '#ccc',
			selectable: false,
		});
		canvas.add(lineY, lineX);
		canvas.sendToBack(lineX);
		canvas.sendToBack(lineY);
	}
};
