import {
	ObjectDataFromServer,
	MemberInCanvas,
	UserMousePointer,
	ObjectType,
} from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import {
	createNameLabel,
	createPostIt,
	createRect,
	createTextBox,
	setLimitHeightEvent,
	setPostItEditEvent,
	setPreventResizeEvent,
} from './object.utils';

export const createObjectFromServer = (canvas: fabric.Canvas, newObject: ObjectDataFromServer) => {
	if (newObject.type === ObjectType.postit) {
		createPostitFromServer(canvas, newObject);
	}
};

export const createPostitFromServer = (canvas: fabric.Canvas, newObject: ObjectDataFromServer) => {
	const { objectId, left, top, fontSize, color, text, width, height, creator } = newObject;
	if (!left || !top || !fontSize || !color || !text || !width || !height) return;
	const nameLabel = createNameLabel({ objectId, text: creator, left, top });
	const textBox = createTextBox({ objectId, left, top, fontSize, text, editable: false });
	const editableTextBox = createTextBox({ objectId, left, top, fontSize, text, editable: true });

	const backgroundRect = createRect({ objectId, left, top, color });
	backgroundRect.set({
		// width,
		// height,
		isSocketObject: true,
	});
	textBox.set({
		// width,
		// height,
		isSocketObject: true,
	});
	nameLabel.set({
		isSocketObject: true,
	});

	const postit = createPostIt({ objectId, left, top, textBox, nameLabel, backgroundRect });
	postit.set({
		isSocketObject: true,
	});
	setLimitHeightEvent(canvas, textBox, backgroundRect);
	setLimitHeightEvent(canvas, editableTextBox, postit);
	setPostItEditEvent(canvas, postit, editableTextBox, textBox);
	setPreventResizeEvent(objectId, canvas, textBox, postit);
	canvas.add(postit);
};

export const deleteObjectFromServer = (canvas: fabric.Canvas, objectId: string) => {
	canvas.forEachObject((object) => {
		if (object.objectId === objectId) canvas.remove(object);
	});
};

export const moveCursorFromServer = (membersInCanvas: MemberInCanvas[], userMousePointer: UserMousePointer) => {
	const { userId, x, y } = userMousePointer;
	const memberInCanvasById = membersInCanvas.filter((memberInCanvas) => memberInCanvas.userId === userId);
	if (memberInCanvasById.length === 0 || !memberInCanvasById[0].cursorObject) return;
	memberInCanvasById[0].cursorObject.set({ top: y, left: x });
	memberInCanvasById[0].cursorObject.bringToFront();
};

export const updateObjectFromServer = (canvas: fabric.Canvas, updatedObject: ObjectDataFromServer) => {
	const object: fabric.Object[] = canvas.getObjects().filter((object) => {
		return object.objectId === updatedObject.objectId;
	});

	if (object.length === 0) return;
	object[0].set({
		...updatedObject,
	});

	if (object[0].type === ObjectType.postit) {
		const groupObject = object[0] as fabric.Group;
		groupObject._objects.forEach((object) => {
			if (object.type === ObjectType.text && updatedObject.text && updatedObject.fontSize) {
				const textObject = object as fabric.Text;
				textObject.set({
					text: updatedObject.text,
					fontSize: updatedObject.fontSize,
				});
			}
		});
	}
};

export const selectObjectFromServer = (canvas: fabric.Canvas, objectIds: string[], color: string) => {
	console.log(objectIds);
	const objects: fabric.Object[] = canvas.getObjects().filter((object) => {
		return objectIds.includes(object.objectId);
	});

	if (objects.length === 0) return;

	const groupObjects = objects as fabric.Group[];
	groupObjects.forEach((groupObject) => {
		groupObject._objects.forEach((object) => {
			if (object.type === ObjectType.rect) {
				object.set({
					stroke: color,
					strokeWidth: 3,
				});
			}
		});
	});
};

export const unselectObjectFromServer = (canvas: fabric.Canvas, objectIds: string[]) => {
	const objects: fabric.Object[] = canvas.getObjects().filter((object) => {
		return objectIds.includes(object.objectId);
	});

	if (objects.length === 0) return;

	const groupObjects = objects as fabric.Group[];
	groupObjects.forEach((groupObject) => {
		groupObject._objects.forEach((object) => {
			if (object.type === ObjectType.rect) {
				object.set({
					stroke: '',
					strokeWidth: 0,
				});
			}
		});
	});
};

export const createCursorObject = (color: string) => {
	const cursorObject = new fabric.Path(
		'M10.9231 16.0296C11.0985 16.4505 10.9299 18.0447 10 18.4142C9.07008 18.7837 7.88197 18.4142 7.88197 18.4142L5.72605 14.1024L2 17.8284V1L13.4142 12.4142H9.16151C9.37022 12.8144 10.7003 15.4948 10.9231 16.0296Z'
	);
	cursorObject.set({ fill: color, selectable: false, hoverCursor: 'normal' });
	return cursorObject;
};
