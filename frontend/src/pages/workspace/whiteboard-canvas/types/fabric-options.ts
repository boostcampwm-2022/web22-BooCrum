import { SocketObjectType } from '@pages/workspace/whiteboard-canvas/types';
export interface TitleBackgroundOptions {
	objectId: string;
	left: number;
	top: number;
	color: string;
}

export interface SectionOption {
	objectId: string;
	left: number;
	top: number;
	sectionTitle: fabric.IText;
	titleBackground: fabric.Rect;
	backgroundRect: fabric.Rect;
	selectable: boolean;
}

export interface SectionTitleOptions {
	editable: boolean;
	objectId: string;
	text?: string;
	left: number;
	top: number;
	groupType?: SocketObjectType;
}

export interface PostItOptions {
	objectId: string;
	left: number;
	top: number;
	textBox: fabric.Textbox;
	nameLabel: fabric.Text;
	backgroundRect: fabric.Rect;
	selectable: boolean;
}

export interface TextBoxOptions {
	objectId: string;
	left: number;
	top: number;
	fontSize: number;
	text?: string;
	editable: boolean;
	groupType?: SocketObjectType;
}

export interface RectOptions {
	objectId: string;
	left: number;
	top: number;
	color: string;
}

export interface NameLabelOptions {
	objectId: string;
	text: string;
	left: number;
	top: number;
}
