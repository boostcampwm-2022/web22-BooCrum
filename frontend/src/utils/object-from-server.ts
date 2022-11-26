import { CanvasObject, MemberInCanvas, UserMousePointer } from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';

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

export const moveCursorFromServer = (membersInCanvas: MemberInCanvas[], userMousePointer: UserMousePointer) => {
	const { userId, x, y } = userMousePointer;
	const memberInCanvasById = membersInCanvas.filter((memberInCanvas) => memberInCanvas.userId === userId);
	if (memberInCanvasById.length === 0) return;
	memberInCanvasById[0].cursorObject.set({ top: y, left: x });
};

export const createCursorObject = (color: string) => {
	const cursorObject = new fabric.Path(
		'M10.9231 16.0296C11.0985 16.4505 10.9299 18.0447 10 18.4142C9.07008 18.7837 7.88197 18.4142 7.88197 18.4142L5.72605 14.1024L2 17.8284V1L13.4142 12.4142H9.16151C9.37022 12.8144 10.7003 15.4948 10.9231 16.0296Z'
	);
	cursorObject.set({ fill: color });
	return cursorObject;
};
