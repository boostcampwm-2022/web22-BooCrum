import {
	ObjectDataFromServer,
	MemberInCanvas,
	UserMousePointer,
	ObjectType,
	Member,
	SocketObjectType,
} from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import { v4 } from 'uuid';
import {
	createNameLabel,
	createPostIt,
	createRect,
	createSection,
	createSectionTitle,
	createTextBox,
	createTitleBackground,
	setLimitChar,
	setLimitHeightEvent,
	setPostItEditEvent,
	setPreventResizeEvent,
	setSectionEditEvent,
} from './object.utils';

export const createObjectFromServer = (canvas: fabric.Canvas, newObject: ObjectDataFromServer) => {
	if (newObject.type === SocketObjectType.postit) {
		createPostitFromServer(canvas, newObject);
	}

	if (newObject.type === SocketObjectType.section) {
		createSectionFromServer(canvas, newObject);
	}

	if (newObject.type === SocketObjectType.draw) {
		createDrawFromServer(canvas, newObject);
	}
};

export const createDrawFromServer = (canvas: fabric.Canvas, newObject: ObjectDataFromServer) => {
	const drawObject = new fabric.Path(newObject.path, {
		type: newObject.type,
		objectId: newObject.objectId,
		isSocketObject: true,
		left: newObject.left,
		top: newObject.top,
		width: newObject.width,
		height: newObject.height,
		scaleX: newObject.scaleX,
		scaleY: newObject.scaleY,
		stroke: newObject.color,
		strokeWidth: canvas.freeDrawingBrush.width,
		fill: undefined,
	});
	canvas.add(drawObject);
};

export const createPostitFromServer = (canvas: fabric.Canvas, newObject: ObjectDataFromServer) => {
	const { objectId, left, top, fontSize, color, text, width, height, creator, scaleX, scaleY } = newObject;
	if (!left || !top || !fontSize || !color || !text || !width || !height || !scaleX || !scaleY) return;
	const nameLabel = createNameLabel({ objectId, text: creator, left, top });
	const textBox = createTextBox({ objectId, left, top, fontSize, text, editable: false });
	const editableTextBox = createTextBox({ objectId, left, top, fontSize, text, editable: true });
	const backgroundRect = createRect({ objectId, left, top, color });

	backgroundRect.set({
		isSocketObject: true,
	});
	textBox.set({
		isSocketObject: true,
	});
	nameLabel.set({
		isSocketObject: true,
	});

	const postit = createPostIt({ objectId, left, top, textBox, nameLabel, backgroundRect });

	editableTextBox.set({
		isSocketObject: true,
		groupType: SocketObjectType.postit,
	});

	postit.set({
		isSocketObject: true,
		scaleX,
		scaleY,
	});

	setLimitHeightEvent(canvas, textBox, backgroundRect);
	setLimitHeightEvent(canvas, editableTextBox, postit);
	setPostItEditEvent(canvas, postit, editableTextBox, textBox);
	setPreventResizeEvent(objectId, canvas, textBox, postit);
	canvas.add(postit);
};

export const createSectionFromServer = (canvas: fabric.Canvas, newObject: ObjectDataFromServer) => {
	const { objectId, left, top, fontSize, color, scaleX, scaleY, text } = newObject;
	if (!left || !top || !fontSize || !color || !scaleX || !scaleY || !text) return;

	const editableTitle = createSectionTitle({ objectId, text: text, left, top: top + 25, editable: true });
	const sectionTitle = createSectionTitle({ objectId, text: text, left, top, editable: false });
	const sectionBackground = createTitleBackground({ objectId, left, top, color });
	const backgroundRect = createRect({ objectId, left, top, color });

	sectionTitle.set({
		isSocketObject: true,
	});
	sectionBackground.set({
		isSocketObject: true,
	});
	backgroundRect.set({
		isSocketObject: true,
	});

	const section = createSection({
		objectId,
		left,
		top,
		sectionTitle,
		titleBackground: sectionBackground,
		backgroundRect,
	});

	editableTitle.set({
		isSocketObject: true,
		group: section,
		groupType: SocketObjectType.section,
	});

	section.set({
		isSocketObject: true,
		scaleX,
		scaleY,
	});

	setLimitChar(canvas, section, sectionTitle, sectionBackground);
	setLimitChar(canvas, section, editableTitle, sectionBackground);
	setSectionEditEvent(canvas, section, editableTitle, sectionTitle);
	canvas.add(section);
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
	memberInCanvasById[0].cursorObject.bringToFront();
};

export const updateObjectFromServer = (canvas: fabric.Canvas, updatedObject: ObjectDataFromServer) => {
	const object: fabric.Object[] = canvas.getObjects().filter((object) => {
		return object.objectId === updatedObject.objectId;
	});

	if (object.length === 0) return;

	if (object[0].type === SocketObjectType.draw) {
		const { path, ...updateProperty } = updatedObject;
		object[0].set({
			...updateProperty,
		});
		return;
	}

	object[0].set({
		...updatedObject,
	});

	if (object[0] instanceof fabric.Group) {
		const groupObject = object[0] as fabric.Group;
		groupObject._objects.forEach((object) => {
			if (object.type === ObjectType.text || object.type === ObjectType.title) {
				const textObject = object as fabric.Text;
				textObject.set({
					text: updatedObject.text || textObject.text,
					fontSize: updatedObject.fontSize || textObject.fontSize,
				});
			} else if (object.type === ObjectType.rect && updatedObject.color) {
				const backgroundRect = object as fabric.Rect;
				backgroundRect.set({ fill: updatedObject.color });
			}
		});
	}
};

export const selectObjectFromServer = (canvas: fabric.Canvas, objectIds: string[], color: string) => {
	const objects: fabric.Object[] = canvas.getObjects().filter((object) => {
		return objectIds.includes(object.objectId);
	});

	if (objects.length === 0) return;

	objects.forEach((object) => {
		if (object instanceof fabric.Group) {
			object._objects.forEach((_object) => {
				if (_object.type === ObjectType.rect) {
					_object.set({
						stroke: color,
						strokeWidth: 3,
					});
				}
			});
		}
	});
};

export const unselectObjectFromServer = (canvas: fabric.Canvas, objectIds: string[]) => {
	const objects: fabric.Object[] = canvas.getObjects().filter((object) => {
		return objectIds.includes(object.objectId);
	});

	if (objects.length === 0) return;

	objects.forEach((object) => {
		if (object instanceof fabric.Group) {
			object._objects.forEach((_object) => {
				if (_object.type === ObjectType.rect) {
					_object.set({
						stroke: '',
						strokeWidth: 0,
					});
				}
			});
		}
	});
};

export const createCursorObject = (member: Member) => {
	const cursorObject = new fabric.Path(
		'M10.9231 16.0296C11.0985 16.4505 10.9299 18.0447 10 18.4142C9.07008 18.7837 7.88197 18.4142 7.88197 18.4142L5.72605 14.1024L2 17.8284V1L13.4142 12.4142H9.16151C9.37022 12.8144 10.7003 15.4948 10.9231 16.0296Z'
	);
	cursorObject.set({
		type: ObjectType.cursor,
		objectId: v4(),
		fill: member.color,
		selectable: false,
		hoverCursor: 'normal',
		isSocketObject: true,
	});
	return cursorObject;
};
