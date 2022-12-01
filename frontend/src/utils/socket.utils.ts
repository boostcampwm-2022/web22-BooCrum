import {
	ObjectType,
	ObjectDataToServer,
	ObjectDataFromServer,
	CanvasObject,
} from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
export const formatMessageToSocket = (object: fabric.Object): ObjectDataToServer => {
	const message: ObjectDataToServer = {
		objectId: object.objectId,
		left: object.left,
		top: object.top,
		width: object.width,
		height: object.height,
		// color: object.fill as string,
		scaleX: object.scaleX,
		scaleY: object.scaleY,
	};

	return message;
};

export const formatCreatePostitEventToSocket = (objectGroup: fabric.Group): ObjectDataToServer => {
	// todo fabric.Object -> text 포함된 타입으로 변경 필요
	const message: ObjectDataToServer = {
		type: ObjectType.postit,
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
		if (object.type === ObjectType.text) {
			const textObject = object as fabric.Text;
			message.text = textObject.text;
			message.fontSize = textObject.fontSize;
		}
	});

	return message;
};

export interface MoveObjectEventParmas {
	object: fabric.Object;
	dleft: number;
	dtop: number;
}

export const formatMoveObjectEventToSocket = ({ object, dleft, dtop }: MoveObjectEventParmas): ObjectDataToServer => {
	// todo fabric.Object -> text 포함된 타입으로 변경 필요
	const message: ObjectDataToServer = {
		objectId: object.objectId,
		dleft,
		dtop,
	};

	return message;
};

export interface ScaleObjectEventParams extends MoveObjectEventParmas {
	scaleX: number;
	scaleY: number;
}

export const formatScalingObjectEventToSocket = ({
	object,
	dleft,
	dtop,
	scaleX,
	scaleY,
}: ScaleObjectEventParams): ObjectDataToServer => {
	// scaling 추가
	const message: ObjectDataToServer = {
		objectId: object.objectId,
		dleft,
		dtop,
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
