import { CanvasObject } from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import { v4 } from 'uuid';
export const createMessageForCreateObjectEvent = (canvas: fabric.Canvas, object: fabric.Object) => {
	const message: CanvasObject = {
		// todo mode 타입 정의 필요
		objectId: v4(),
		type: canvas.mode,
		xPos: object.left,
		yPos: object.top,
		width: object.width,
		height: object.height,
		color: object.fill as string,
	};
	return message;
};

// @IsString()
// type: string;

// @IsNumber()
// xPos: number;

// @IsNumber()
// yPos: number;

// @IsNumber()
// width: number;

// @IsNumber()
// height: number;

// @IsString()
// color: string;
