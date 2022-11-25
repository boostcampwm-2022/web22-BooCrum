import { colorChips } from '@data/workspace-object-color';
import { fabric } from 'fabric';
import { v4 } from 'uuid';

export const addSection = (canvas: fabric.Canvas, x: number, y: number) => {
	canvas.add(
		new fabric.Rect({
			objectId: v4(),
			left: x,
			top: y,
			fill: colorChips[0],
			width: 400,
			height: 500,
			objectCaching: false,
		})
	);
};

export const addPostIt = (canvas: fabric.Canvas, x: number, y: number) => {
	canvas.add(
		new fabric.Rect({
			objectId: v4(),
			left: x,
			top: y,
			fill: colorChips[0],
			width: 300,
			height: 200,
			objectCaching: false,
		})
	);
};

export const setEditMenu = (object: fabric.Object) => {
	const width = object?.width || 0;
	const top = object?.top ? object.top - 50 : 0;
	const left = object?.left ? object.left + width / 2 : 0;

	return [left, top];
};
