import { workspaceRole } from '@data/workspace-role';
import { Workspace } from '@api/workspace';
import {
	ObjectDataFromServer,
	MemberInCanvas,
	UserMousePointer,
	ObjectType,
	Member,
	SocketObjectType,
	Role,
} from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import LZString from 'lz-string';
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
	setPreventRemainCursor,
	setPreventResizeEvent,
	setSectionEditEvent,
} from './object.utils';
import { isNull, isUndefined } from './type.utils';

export const createObjectFromServer = (
	canvas: fabric.Canvas,
	newObject: ObjectDataFromServer,
	role: Role,
	workspaceId: string | undefined
) => {
	if (newObject.type === SocketObjectType.postit) {
		createPostitFromServer(canvas, newObject, role, workspaceId);
	}

	if (newObject.type === SocketObjectType.section) {
		createSectionFromServer(canvas, newObject, role);
	}

	if (newObject.type === SocketObjectType.draw) {
		createDrawFromServer(canvas, newObject);
	}
};

export const createDrawFromServer = (canvas: fabric.Canvas, newObject: ObjectDataFromServer) => {
	let decodedPath;
	if (isUndefined(newObject.path)) return;
	// 이전에 생성된 path들은 decompress 하지 않는다.
	if (newObject.path[0] !== 'M') decodedPath = LZString.decompress(newObject.path || '');
	else decodedPath = newObject.path;

	if (isNull(decodedPath)) return;
	const drawObject = new fabric.Path(decodedPath, {
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
		strokeLineCap: 'round',
		strokeLineJoin: 'round',
		fill: undefined,
		lockRotation: true,
	});
	canvas.add(drawObject);
};

export const createPostitFromServer = async (
	canvas: fabric.Canvas,
	newObject: ObjectDataFromServer,
	role: Role,
	workspaceId: string | undefined
) => {
	const { objectId, left, top, fontSize, color, text, width, height, creator, scaleX, scaleY } = newObject;
	if (!left || !top || !fontSize || !color || isUndefined(text) || !width || !height || !scaleX || !scaleY) return;

	const participants = await Workspace.getWorkspaceParticipant(workspaceId || '');
	const user = participants.filter((part) => {
		if (part.user.userId === creator) return true;
	});

	const nameLabel = createNameLabel({ objectId, text: user.length ? user[0].user.nickname : '', left, top });
	const textBox = createTextBox({ objectId, left, top, fontSize, text, editable: false });
	const editableTextBox = createTextBox({ objectId, left, top, fontSize, text, editable: true });
	const backgroundRect = createRect(ObjectType.postit, { objectId, left, top, color });

	backgroundRect.set({
		isSocketObject: true,
	});
	textBox.set({
		isSocketObject: true,
		scaleX: 1 / scaleX,
		scaleY: 1 / scaleY,
		width: width * scaleX * 0.9,
	});
	nameLabel.set({
		isSocketObject: true,
	});

	const selectable = role !== workspaceRole.GUEST;
	const postit = createPostIt({ objectId, left, top, textBox, nameLabel, backgroundRect, selectable });

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
	setPreventRemainCursor(canvas, editableTextBox);
	canvas.add(postit);
};

export const createSectionFromServer = (canvas: fabric.Canvas, newObject: ObjectDataFromServer, role: Role) => {
	const { objectId, left, top, fontSize, color, scaleX, scaleY, text } = newObject;
	if (!left || !top || !fontSize || !color || !scaleX || !scaleY || isUndefined(text)) return;

	const editableTitle = createSectionTitle({ objectId, text: text, left, top: top + 25, editable: true });
	const sectionTitle = createSectionTitle({ objectId, text: text, left, top, editable: false });
	const sectionBackground = createTitleBackground({ objectId, left, top, color });
	const backgroundRect = createRect(ObjectType.section, { objectId, left, top, color });

	sectionTitle.set({
		isSocketObject: true,
	});
	sectionBackground.set({
		isSocketObject: true,
	});
	backgroundRect.set({
		isSocketObject: true,
	});

	const selectable = role !== workspaceRole.GUEST;
	const section = createSection({
		objectId,
		left,
		top,
		sectionTitle,
		titleBackground: sectionBackground,
		backgroundRect,
		selectable,
	});

	editableTitle.set({
		isSocketObject: true,
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
	setPreventRemainCursor(canvas, editableTitle);

	canvas.add(section);
	sectionTitle.fire('changed');
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

const updateObject = (object: fabric.Object, updatedObject: ObjectDataFromServer) => {
	object.set({ ...updatedObject });

	if (object instanceof fabric.Group) {
		const groupObject = object as fabric.Group;
		groupObject._objects.forEach((obj) => {
			if (obj.type === ObjectType.text || obj.type === ObjectType.title) {
				const textObject = obj as fabric.Text;
				textObject.set({
					text: updatedObject.text || textObject.text,
					fontSize: updatedObject.fontSize || textObject.fontSize,
					scaleX: 1 / (groupObject.scaleX || 1),
					scaleY: 1 / (groupObject.scaleY || 1),
					width: groupObject.getScaledWidth() * 0.9,
				});
			} else if (obj.type === ObjectType.rect && updatedObject.color) {
				const backgroundRect = obj as fabric.Rect;
				backgroundRect.set({ fill: updatedObject.color });
			}
		});
	}
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

	const { type, ...updatedProperty } = updatedObject;

	if (object[0].type === ObjectType.editable) {
		const [editableText, rectObject] = object;
		let left = editableText.left,
			top = editableText.top;
		const width = rectObject.getScaledWidth() * 0.9;

		if (rectObject.type === ObjectType.postit) {
			left = updatedProperty.left ? updatedProperty.left + rectObject.getScaledWidth() * 0.05 : left;
			top = updatedProperty.top ? updatedProperty.top + rectObject.getScaledHeight() * 0.05 : top;
		} else if (rectObject.type === ObjectType.section) {
			left = updatedProperty.left ? updatedProperty.left + rectObject.getScaledWidth() * 0.05 : left;
		}

		editableText.set({
			left,
			top,
			width,
		});

		rectObject.set({ ...updatedObject });
	} else {
		object.forEach((obj) => {
			updateObject(obj, updatedObject);
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
