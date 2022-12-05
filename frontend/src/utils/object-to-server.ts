import { ObjectType, ObjectDataToServer, SocketObjectType } from '@pages/workspace/whiteboard-canvas/types';

import { fabric } from 'fabric';

export const formatObjectDataToServer = (objectGroup: fabric.Group, type: SocketObjectType): ObjectDataToServer => {
	const message: ObjectDataToServer = {
		type: type,
		objectId: objectGroup.objectId,
		left: objectGroup.left,
		top: objectGroup.top,
		width: objectGroup.width,
		height: objectGroup.height,
		scaleX: objectGroup.scaleX || 1,
		scaleY: objectGroup.scaleY || 1,
	};

	objectGroup._objects.forEach((object) => {
		if (object.type === ObjectType.rect) {
			message.color = object.fill as string;
		}
		if (object.type === ObjectType.text || object.type === ObjectType.title) {
			const textObject = object as fabric.Text;
			message.text = textObject.text;
			message.fontSize = textObject.fontSize;
		}
	});
	return message;
};

export const formatMessageToSocketForGroup = (group: fabric.Group, object: fabric.Group): ObjectDataToServer => {
	const groupCenterPoint = group.getCenterPoint();
	const objectDataMessage = formatObjectDataToServer(object, object.type as SocketObjectType);

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

export const formatScalingObjectEventToSocket = (object: fabric.Object) => {
	const message: ObjectDataToServer = {
		objectId: object.objectId,
		left: object.left,
		top: object.top,
		scaleX: object.scaleX,
		scaleY: object.scaleY,
	};
	return message;
};

export const formatScalingObjectEventToSocketForGroup = (
	group: fabric.Object,
	object: fabric.Object
): ObjectDataToServer | undefined => {
	const groupCenterPoint = group.getCenterPoint();
	if (
		object.left === undefined ||
		object.top === undefined ||
		object.scaleX === undefined ||
		object.scaleY === undefined ||
		group.scaleX === undefined ||
		group.scaleY === undefined
	)
		return;

	const left = groupCenterPoint.x + object.left * group.scaleX;
	const top = groupCenterPoint.y + object.top * group.scaleY;
	const scaleX = group.scaleX * object.scaleX;
	const scaleY = group.scaleY * object.scaleY;

	const message: ObjectDataToServer = {
		objectId: object.objectId,
		left,
		top,
		scaleX,
		scaleY,
	};
	return message;
};

export const formatEditTextEventToSocket = (object: fabric.Text): ObjectDataToServer => {
	// scaling 추가
	const message: ObjectDataToServer = {
		objectId: object.objectId,
		text: object.text,
		fontSize: object.fontSize,
	};

	return message;
};
