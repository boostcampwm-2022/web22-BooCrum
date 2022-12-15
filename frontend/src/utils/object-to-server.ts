import { ObjectType, ObjectDataToServer, SocketObjectType } from '@pages/workspace/whiteboard-canvas/types';

import { fabric } from 'fabric';
import LZString from 'lz-string';
import { v4 } from 'uuid';
import { toStringPath } from './fabric.utils';

export const formatEditColorEventToSocket = (objectGroup: fabric.Group) => {
	const currentObject = objectGroup._objects[0];
	const message: ObjectDataToServer = {
		type: objectGroup.type as SocketObjectType,
		objectId: objectGroup.objectId,
		color: currentObject.fill as string,
	};
	return message;
};

export const formatEditFontSizeEventToSocket = (textObject: fabric.Text) => {
	const message: ObjectDataToServer = {
		type: SocketObjectType.postit,
		objectId: textObject.objectId,
		fontSize: textObject.fontSize,
	};

	return message;
};

export const formatObjectDataToServer = (fabricObject: fabric.Object): ObjectDataToServer => {
	const message: ObjectDataToServer = {
		type: fabricObject.type as SocketObjectType,
		objectId: fabricObject.objectId,
		left: fabricObject.left,
		top: fabricObject.top,
		width: fabricObject.width,
		height: fabricObject.height,
		scaleX: fabricObject.scaleX || 1,
		scaleY: fabricObject.scaleY || 1,
	};

	if (fabricObject instanceof fabric.Path) {
		message.color = fabricObject.stroke;
		const path = toStringPath(fabricObject as fabric.Path);
		const lzstring = LZString.compressToUTF16(path);
		const encodedPath = encodeURI(lzstring);
		message.path = encodedPath;
	}

	if (fabricObject instanceof fabric.Group) {
		fabricObject._objects.forEach((object) => {
			if (object.type === ObjectType.rect) {
				message.color = object.fill as string;
			}
			if (object.type === ObjectType.text || object.type === ObjectType.title) {
				const textObject = object as fabric.Text;
				message.text = textObject.text;
				message.fontSize = textObject.fontSize;
			}
		});
	}

	return message;
};

export const formatMessageToSocketForGroup = (group: fabric.Group, object: fabric.Object): ObjectDataToServer => {
	const groupCenterPoint = group.getCenterPoint();
	const objectDataMessage = formatObjectDataToServer(object);

	const message: ObjectDataToServer = {
		...objectDataMessage,
		left: groupCenterPoint.x + (objectDataMessage.left || 0) * (group.scaleX || 1),
		top: groupCenterPoint.y + (objectDataMessage.top || 0) * (group.scaleY || 1),
		scaleX: (group.scaleX || 1) * (objectDataMessage.scaleX || 1),
		scaleY: (group.scaleY || 1) * (objectDataMessage.scaleY || 1),
	};

	return message;
};

export const formatMoveObjectEventToSocket = (objectGroup: fabric.Group): ObjectDataToServer => {
	const message: ObjectDataToServer = {
		objectId: objectGroup.objectId,
		left: objectGroup.left,
		top: objectGroup.top,
	};

	return message;
};

export const formatMoveObjectEventToSocketForGroup = (
	group: fabric.Group,
	object: fabric.Group
): ObjectDataToServer => {
	const groupCenterPoint = group.getCenterPoint();
	const objectDataMessage = formatMoveObjectEventToSocket(object);

	const message: ObjectDataToServer = {
		...objectDataMessage,
		left: groupCenterPoint.x + (objectDataMessage.left || 0) * (group.scaleX || 1),
		top: groupCenterPoint.y + (objectDataMessage.top || 0) * (group.scaleY || 1),
	};

	return message;
};

export const formatScaleObjectEventToSocket = (object: fabric.Group) => {
	const message: ObjectDataToServer = {
		objectId: object.objectId,
		left: object.left,
		top: object.top,
		scaleX: object.scaleX,
		scaleY: object.scaleY,
	};
	return message;
};

export const formatScaleObjectEventToSocketForGroup = (
	group: fabric.Group,
	object: fabric.Group
): ObjectDataToServer => {
	const groupCenterPoint = group.getCenterPoint();
	const objectDataMessage = formatScaleObjectEventToSocket(object);

	const message: ObjectDataToServer = {
		...objectDataMessage,
		left: groupCenterPoint.x + (objectDataMessage.left || 0) * (group.scaleX || 1),
		top: groupCenterPoint.y + (objectDataMessage.top || 0) * (group.scaleY || 1),
		scaleX: (group.scaleX || 1) * (objectDataMessage.scaleX || 1),
		scaleY: (group.scaleY || 1) * (objectDataMessage.scaleY || 1),
	};
	return message;
};

export const formatEditTextEventToSocket = (object: fabric.Text): ObjectDataToServer => {
	const message: ObjectDataToServer = {
		type: object.groupType as SocketObjectType,
		objectId: object.objectId,
		text: object.text,
		fontSize: object.fontSize,
	};

	return message;
};

export const formatSelectEventToSocket = (objects: fabric.Object[]) => {
	const message = {
		objectIds: objects.map((object) => object.objectId),
	};
	return message;
};

export const initDrawObject = (object: fabric.Path) => {
	object.objectId = v4();
	object.type = SocketObjectType.draw;
	object.isSocketObject = false;
};
