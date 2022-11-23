export interface CanvasObject {
	type: 'postit' | 'section' | 'draw';
	objectId: string;
	x: number;
	y: number;
	width: number;
	height: number;
	backgroundColor: string;
	createdBy: string;
	text?: string;
}
