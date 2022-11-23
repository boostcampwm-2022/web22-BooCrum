import { fabric } from 'fabric';
import { CanvasObject } from '@pages/workspace/whiteboard-canvas/index.types';
import { v4 } from 'uuid';

export const drawingGird = (canvas: fabric.Canvas, width: number, height: number, gridSize: number) => {
	for (let i = 0; i < width / gridSize; i++) {
		const lineY = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
		});
		const lineX = new fabric.Line([0, i * gridSize, width, i * gridSize], {
			objectId: v4(),
			type: 'line',
			stroke: '#ccc',
			selectable: false,
		});
		canvas.add(lineY, lineX);
		canvas.sendToBack(lineX);
		canvas.sendToBack(lineY);
	}
};

export const createObjectFromServer = (canvas: fabric.Canvas, newObject: CanvasObject) => {
	const rect = new fabric.Rect({
		...newObject,
	});

	canvas.add(rect);
};
