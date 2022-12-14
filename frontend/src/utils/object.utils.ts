import { fabric } from 'fabric';
import { CanvasType, ObjectType, SocketObjectType } from '@pages/workspace/whiteboard-canvas/types';
import { v4 } from 'uuid';
import {
	NameLabelOptions,
	PostItOptions,
	RectOptions,
	SectionOption,
	SectionTitleOptions,
	TextBoxOptions,
	TitleBackgroundOptions,
} from '@pages/workspace/whiteboard-canvas/types/fabric-options';
import { isUndefined } from './type.utils';

export const setEditMenu = (object: fabric.Object) => {
	const width = object?.width || 0;
	const top = object?.top ? object.top - 50 : 0;
	const left = object?.left ? object.left + width / 2 : 0;

	return [left, top];
};

const setShadow = () => {
	return new fabric.Shadow({
		color: 'gray',
		blur: 7,
		offsetX: 1,
		offsetY: 1,
	});
};

export const createNameLabel = (options: NameLabelOptions) => {
	const defaultLeft = options.left + 300 * 0.05;
	const defaultTop = options.top + 275;
	const defaultFontSize = 15;

	const nameLabelText = new fabric.Text(options.text || '', {
		type: ObjectType.nameText,
		objectId: options.objectId,
		top: defaultTop,
		left: defaultLeft,
		fontSize: defaultFontSize,
		fontFamily: 'Arial, sans-serif',
		isSocketObject: false,
		lockMovementX: true,
		lockMovementY: true,
	});

	return nameLabelText;
};

export const createRect = (type: ObjectType, options: RectOptions) => {
	const defaultWidth = 300;
	const defaultHeight = 300;

	const rect = new fabric.Rect({
		objectId: options.objectId,
		type: ObjectType.rect,
		left: options.left,
		top: options.top,
		fill: options.color,
		width: defaultWidth,
		height: defaultHeight,
		isSocketObject: false,
	});

	if (type === ObjectType.postit) rect.set({ shadow: setShadow() });
	else if (type === ObjectType.section) {
		rect.set({
			opacity: 0.8,
			rx: 5,
			ry: 5,
		});
	}

	return rect;
};

export const createTextBox = (options: TextBoxOptions) => {
	const defaultTop = options.top + 300 * 0.05;
	const defaultLeft = options.left + 300 * 0.05;
	const defaultWidth = 300 * 0.9;
	const defaultText = 'Text...';

	const textbox = new fabric.Textbox(isUndefined(options.text) ? defaultText : options.text, {
		type: options.editable ? ObjectType.editable : ObjectType.text,
		top: defaultTop,
		left: defaultLeft,
		objectId: options.objectId,
		width: defaultWidth,
		splitByGrapheme: true,
		fontSize: options.fontSize,
		fontFamily: 'Arial, sans-serif',
		isSocketObject: false,
		selectable: false,
		evented: false,
		groupType: options.groupType,
		lockMovementX: true,
		lockMovementY: true,
	});

	return textbox;
};

export const createPostIt = (options: PostItOptions) => {
	const postit = new fabric.Group([options.backgroundRect, options.textBox, options.nameLabel], {
		objectId: options.objectId,
		type: ObjectType.postit,
		left: options.left,
		top: options.top,
		isSocketObject: false,
		selectable: options.selectable,
		lockRotation: true,
		lockScalingFlip: true,
	});

	postit.set({ left: options.left, top: options.top });

	return postit;
};

export const setLimitHeightEvent = (
	canvas: fabric.Canvas,
	textBox: fabric.Textbox,
	background: fabric.Group | fabric.Rect
) => {
	const handler = (e: fabric.IEvent<Event>) => {
		if (!textBox.height || !textBox.fontSize || !background.height) return;
		while (textBox.getScaledHeight() > background.getScaledHeight() * 0.9 && textBox.fontSize > 12) {
			textBox.fontSize--;
			canvas.renderAll();
		}
	};

	textBox.on('changed', handler);
};

export const setPostItEditEvent = (
	canvas: fabric.Canvas,
	groupObject: fabric.Group,
	editableTextBox: fabric.Textbox,
	textBox: fabric.Textbox
) => {
	let prevCanvasMode: CanvasType;

	groupObject.on('mousedblclick', (e) => {
		if (canvas.mode === CanvasType.move) return;

		prevCanvasMode = canvas.mode;
		textBox.set({ visible: false });
		canvas.add(editableTextBox);
		canvas.setActiveObject(editableTextBox);
		editableTextBox.set({
			text: textBox.text,
			left: (groupObject?.left || 0) + groupObject.getScaledWidth() * 0.05,
			top: (groupObject?.top || 0) + groupObject.getScaledHeight() * 0.05,
			width: groupObject.getScaledWidth() * 0.9,
			fontSize: textBox.fontSize,
			evented: true,
		});
		editableTextBox.enterEditing();
		canvas.mode = CanvasType.edit;
		editableTextBox.fire('changed');
	});

	editableTextBox.on('changed', (e) => {
		const inputText = editableTextBox.text;
		textBox.set({ text: inputText });
	});

	editableTextBox.on('editing:exited', (e) => {
		canvas.remove(editableTextBox);
		textBox.set({ visible: true, fontSize: editableTextBox.fontSize });
		canvas.mode = prevCanvasMode;
		textBox.fire('changed');
	});
};

export const setPreventResizeEvent = (
	id: string,
	canvas: fabric.Canvas,
	textBox: fabric.Textbox | fabric.IText,
	groupObject: fabric.Group
) => {
	canvas.on('object:scaling', (e) => {
		if (e.target?.objectId !== id) return;
		if (!(e.target instanceof fabric.Group)) return;
		const obj = textBox;
		const group = groupObject;
		const scaleX = 1 / (group?.scaleX || 1);
		const scaleY = 1 / (group?.scaleY || 1);
		obj.set({
			scaleX: scaleX,
			scaleY: scaleY,
			width: (group?.getScaledWidth() || 0) * 0.9,
		});
		obj.fire('changed');
	});
};

export const addPostIt = (
	canvas: fabric.Canvas,
	x: number,
	y: number,
	fontSize: number,
	fill: string,
	creator: string
) => {
	const id = v4();
	const nameLabel = createNameLabel({ objectId: id, text: creator, left: x, top: y });
	const textBox = createTextBox({ objectId: id, left: x, top: y, fontSize: fontSize, editable: false });
	const backgroundRect = createRect(ObjectType.postit, { objectId: id, left: x, top: y, color: fill });
	const postit = createPostIt({
		objectId: id,
		left: x,
		top: y,
		textBox: textBox,
		nameLabel: nameLabel,
		backgroundRect: backgroundRect,
		selectable: true,
	});

	const editableTextBox = createTextBox({
		objectId: id,
		left: x,
		top: y,
		fontSize: 40,
		editable: true,
		groupType: SocketObjectType.postit,
	});

	setLimitHeightEvent(canvas, textBox, backgroundRect);
	setLimitHeightEvent(canvas, editableTextBox, postit);
	setPreventResizeEvent(id, canvas, textBox, postit);
	setPostItEditEvent(canvas, postit, editableTextBox, textBox);
	setPreventRemainCursor(canvas, editableTextBox);

	canvas.add(postit);
};

// Section

export const createSectionTitle = (options: SectionTitleOptions) => {
	const defaultLeft = options.left + 10;
	const defaultTop = options.top - 25;
	const defaultFontSize = 15;
	const defaultText = 'SECTION';

	const title = new fabric.IText(isUndefined(options.text) ? defaultText : options.text, {
		type: options.editable ? ObjectType.editable : ObjectType.title,
		objectId: options.objectId,
		top: defaultTop,
		left: defaultLeft,
		fontSize: defaultFontSize,
		fontFamily: 'Arial, sans-serif',
		isSocketObject: false,
		groupType: options.groupType,
		lockMovementX: true,
		lockMovementY: true,
	});

	return title;
};

export const createSection = (options: SectionOption) => {
	const section = new fabric.Group([options.backgroundRect, options.titleBackground, options.sectionTitle], {
		type: ObjectType.section,
		isSocketObject: false,
		objectId: options.objectId,
		left: options.left,
		top: options.top,
		selectable: options.selectable,
		lockRotation: true,
		lockScalingFlip: true,
	});
	return section;
};

export const createTitleBackground = (options: TitleBackgroundOptions) => {
	const defaultWidth = 70;
	const defaultHeight = 20;
	const defaultLeft = options.left + 7;
	const defaultTop = options.top - 25;

	const rect = new fabric.Rect({
		type: ObjectType.rect,
		objectId: options.objectId,
		left: defaultLeft,
		top: defaultTop,
		fill: options.color,
		width: defaultWidth,
		height: defaultHeight,
		isSocketObject: false,
		rx: 10,
		ry: 10,
	});

	return rect;
};

export const setLimitChar = (
	canvas: fabric.Canvas,
	section: fabric.Group,
	title: fabric.IText,
	background: fabric.Rect
) => {
	title.on('editing:entered', () => {
		title.hiddenTextarea?.setAttribute('maxlength', '15');
	});
	const group = section;
	if (!group) return;
	title.on('changed', (e) => {
		background.set({ width: (title.get('width') || 0) + 10 });
		canvas.requestRenderAll();
	});
};

export const setSectionEditEvent = (
	canvas: fabric.Canvas,
	groupObject: fabric.Group,
	editableTitle: fabric.IText,
	sectionTitle: fabric.IText
) => {
	let prevCanvasMode: CanvasType;

	groupObject.on('mousedblclick', (e) => {
		if (canvas.mode === CanvasType.move) return;

		prevCanvasMode = canvas.mode;

		sectionTitle.set({ visible: false });
		canvas.add(editableTitle);
		canvas.setActiveObject(editableTitle);
		editableTitle.set({
			scaleX: groupObject.scaleX,
			scaleY: groupObject.scaleY,
			left: (groupObject?.left || 0) + 10 * (groupObject?.scaleX || 1),
			top: groupObject.top,
			text: sectionTitle.text,
		});
		editableTitle.enterEditing();

		canvas.mode = CanvasType.edit;
	});
	editableTitle.on('changed', (e) => {
		const inputText = editableTitle.text;
		sectionTitle.set({ text: inputText });
	});
	editableTitle.on('editing:exited', (e) => {
		sectionTitle.set({ visible: true });
		canvas.remove(editableTitle);
		canvas.mode = prevCanvasMode;
	});
};

export const addSection = (canvas: fabric.Canvas, x: number, y: number, fill: string) => {
	const id = v4();
	const sectionTitle = createSectionTitle({ objectId: id, text: 'SECTION', left: x, top: y, editable: false });
	const sectionBackground = createTitleBackground({ objectId: id, left: x, top: y, color: fill });
	const backgroundRect = createRect(ObjectType.section, { objectId: id, left: x, top: y, color: fill });
	const section = createSection({
		objectId: id,
		left: x,
		top: y,
		sectionTitle,
		titleBackground: sectionBackground,
		backgroundRect,
		selectable: true,
	});

	const editableTitle = createSectionTitle({
		objectId: id,
		text: 'SECTION',
		left: x,
		top: y + 25,
		editable: true,
		groupType: SocketObjectType.section,
	});

	setLimitChar(canvas, section, sectionTitle, sectionBackground);
	setLimitChar(canvas, section, editableTitle, sectionBackground);
	setSectionEditEvent(canvas, section, editableTitle, sectionTitle);
	setPreventRemainCursor(canvas, editableTitle);

	canvas.add(section);
};

export const setPreventRemainCursor = (canvas: fabric.Canvas, editableText: fabric.Textbox | fabric.IText) => {
	canvas.on('mouse:wheel', () => {
		if (editableText.type === ObjectType.editable) {
			editableText.initDelayedCursor();
		}
	});
};
