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
