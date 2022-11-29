import {
	ObjectType,
	ObjectDataToServer,
	ObjectDataFromServer,
	CanvasObject,
} from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import { v4 } from 'uuid';
export const formatMessageToSocket = (canvas: fabric.Canvas, object: fabric.Object): ObjectDataToServer => {
	// todo fabric.Object -> text 포함된 타입으로 변경 필요
	const message: ObjectDataToServer = {
		type: canvas.mode as ObjectType,
		objectId: v4(),
		left: object.left,
		top: object.top,
		width: object.width,
		height: object.height,
		color: object.fill as string,
		text: '',
		fontSize: 12,
	};

	return message;
};

export const formatPostitToSocket = (canvas: fabric.Canvas, objectGroup: fabric.Group): ObjectDataToServer => {
	// todo fabric.Object -> text 포함된 타입으로 변경 필요
	const message: ObjectDataToServer = {
		type: canvas.mode as ObjectType,
		objectId: v4(),
		left: objectGroup.left,
		top: objectGroup.top,
		width: objectGroup.width,
		height: objectGroup.height,
		// color: object.fill as string,
		// text: '',
		// fontSize: 12,
	};

	objectGroup._objects.forEach((object) => {
		if (object.type === ObjectType.rect) {
			message.color = object.fill as string;
		}
		if (object.type === ObjectType.text) {
			const textObject = object as fabric.Text;
			message.text = textObject.text;
			message.fontSize = textObject.fontSize;
		}
	});

	return message;
};

export const formatMessageFromSocket = (objectDataFromServer: ObjectDataFromServer): CanvasObject => {
	// todo type을 명성님이 만든 객체 class에 맞춰서 사용할지 말지 결정
	const canvasObject: CanvasObject = {
		objectId: objectDataFromServer.objectId,
		left: objectDataFromServer.left,
		top: objectDataFromServer.top,
		width: objectDataFromServer.width,
		height: objectDataFromServer.height,
		fill: objectDataFromServer.color,
		text: objectDataFromServer.text,
		fontSize: objectDataFromServer.fontSize,
	};

	return canvasObject;
};
