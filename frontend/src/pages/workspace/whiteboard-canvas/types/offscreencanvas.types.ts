export interface Position {
	x: number;
	y: number;
}

export interface ZoomPosition extends Position {
	zoom: number;
}

export interface CanvasSize {
	width: number;
	height: number;
}
