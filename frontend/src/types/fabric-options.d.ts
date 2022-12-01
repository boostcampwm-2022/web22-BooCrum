interface TitleBackgroundOptions {
	objectId: string;
	left: number;
	top: number;
	color: string;
}

interface SectionOption {
	objectId: string;
	left: number;
	top: number;
	sectionTitle: fabric.IText;
	titleBackground: fabric.Rect;
	backgroundRect: fabric.Rect;
}

interface SectionTitleOptions {
	editable: boolean;
	objectId: string;
	text?: string;
	left: number;
	top: number;
}

interface PostItOptions {
	objectId: string;
	left: number;
	top: number;
	textBox: fabric.Textbox;
	nameLabel: fabric.Text;
	backgroundRect: fabric.Rect;
}

interface TextBoxOptions {
	objectId: string;
	left: number;
	top: number;
	fontSize: number;
	text?: string;
	editable: boolean;
}

interface RectOptions {
	objectId: string;
	left: number;
	top: number;
	color: string;
}

interface NameLabelOptions {
	objectId: string;
	text: string;
	left: number;
	top: number;
}
