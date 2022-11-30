import { fabric } from 'fabric';
import { ObjectType } from '@pages/workspace/whiteboard-canvas/types';
import { v4 } from 'uuid';

export const setEditMenu = (object: fabric.Object) => {
	const width = object?.width || 0;
	const top = object?.top ? object.top - 50 : 0;
	const left = object?.left ? object.left + width / 2 : 0;

	return [left, top];
};

export const createNameLabel = (options: NameLabelOptions) => {
	const defaultLeft = options.left + 10;
	const defaultTop = options.top + 275;
	const defaultFontSize = 15;

	const nameLabelText = new fabric.Text(options.text || '', {
		type: ObjectType.nameText,
		objectId: options.objectId,
		top: defaultTop,
		left: defaultLeft,
		fontSize: defaultFontSize,
		objectCaching: false,
		isSocketObject: false,
	});

	return nameLabelText;
};

export const createRect = (options: RectOptions) => {
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
		objectCaching: false,
		isSocketObject: false,
	});

	return rect;
};

export const createTextBox = (options: TextBoxOptions) => {
	const defaultTop = options.top + 10;
	const defaultLeft = options.left + 10;
	const defaultWidth = 280;
	const defaultText = 'Text...';

	const textbox = new fabric.Textbox(options.text || defaultText, {
		type: ObjectType.text,
		top: defaultTop,
		left: defaultLeft,
		objectId: options.objectId,
		width: defaultWidth,
		objectCaching: false,
		splitByGrapheme: true,
		fontSize: options.fontSize,
		isSocketObject: false,
	});

	return textbox;
};

export const createPostIt = (options: PostItOptions) => {
	const postit = new fabric.Group([options.backgroundRect, options.textBox, options.nameLabel], {
		objectId: options.objectId,
		type: ObjectType.postit,
		left: options.left,
		top: options.top,
		objectCaching: false,
		isSocketObject: false,
	});

	return postit;
};

export const setLimitHeightEvent = (canvas: fabric.Canvas, textBox: fabric.Textbox, backgroundRect: fabric.Rect) => {
	const handler = (e: fabric.IEvent<Event>) => {
		if (!textBox.height || !textBox.fontSize || !backgroundRect.height) return;
		while (textBox.getScaledHeight() > backgroundRect.getScaledHeight() - 50 && textBox.fontSize > 12) {
			textBox.fontSize--;
			canvas.renderAll();
		}
	};

	textBox.on('changed', handler);
};

export const setObjectEditEvent = (
	canvas: fabric.Canvas,
	groupObject: fabric.Group,
	textBox: fabric.Textbox | fabric.IText
) => {
	const id = groupObject.objectId;

	const ungrouping = (items: fabric.Object[], activeObject: fabric.Group) => {
		activeObject._restoreObjectsState();
		canvas.remove(activeObject);
		for (let i = 0; i < items.length; i++) {
			canvas.add(items[i]);
			items[i].lockMovementX = true;
			items[i].lockMovementY = true;
			const obj = items[i];
			if (obj instanceof fabric.Textbox || obj instanceof fabric.IText) {
				canvas.setActiveObject(items[i]);
				obj.enterEditing();
				obj.selectAll();
			}
		}
	};

	textBox.on('editing:exited', () => {
		const items: fabric.Object[] = [];
		canvas.forEachObject(function (obj) {
			if (obj.objectId == id) {
				items.push(obj);
				canvas.remove(obj);
			}
		});
		const grp = new fabric.Group(items, {
			objectId: id,
			type: ObjectType.postit,
			isSocketObject: false,
		});
		canvas.add(grp);

		grp.on('mousedblclick', () => {
			ungrouping(items, grp);
		});
	});

	groupObject.on('mousedblclick', () => {
		const items = groupObject._objects;
		ungrouping(items, groupObject);
	});
};

export const setPreventResizeEvent = (id: string, canvas: fabric.Canvas, backgroundRect: fabric.Rect) => {
	canvas.on('object:scaling', (e) => {
		if (e.target?.objectId !== id) return;
		if (!(e.target instanceof fabric.Group)) return;
		const objs = e.target._objects;
		const rect = backgroundRect;

		objs.forEach((obj) => {
			if (obj instanceof fabric.Textbox || obj instanceof fabric.IText) {
				const group = e.target;
				const width = (group?.getScaledWidth() || 0) - 20 * (group?.scaleX || 1);

				const scaleX = 1 / (group?.scaleX || 1);
				const scaleY = 1 / (group?.scaleY || 1);
				obj.set({
					scaleX: scaleX,
					scaleY: scaleY,
					width: width,
					left: (rect?.get('left') || 0) + 10,
				});
				obj.fire('changed');
			}
		});
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
	const textBox = createTextBox({ objectId: id, left: x, top: y, fontSize: 40 });
	const backgroundRect = createRect({ objectId: id, left: x, top: y, color: fill });
	const postit = createPostIt({
		objectId: id,
		left: x,
		top: y,
		textBox: textBox,
		nameLabel: nameLabel,
		backgroundRect: backgroundRect,
	});

	setLimitHeightEvent(canvas, textBox, backgroundRect);
	setObjectEditEvent(canvas, postit, textBox);
	setPreventResizeEvent(id, canvas, backgroundRect);

	canvas.add(postit);
};

// Section

export const createSectionTitle = (options: SectionTitleOptions) => {
	const defaultLeft = options.left + 10;
	const defaultTop = options.top - 25;
	const defaultFontSize = 15;

	const title = new fabric.IText(options.text || 'SECTION', {
		type: ObjectType.title,
		objectId: options.objectId,
		top: defaultTop,
		left: defaultLeft,
		fontSize: defaultFontSize,
		isSocketObject: false,
		objectCaching: false,
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
		objectCaching: false,
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
		objectCaching: false,
		isSocketObject: false,
		rx: 10,
		ry: 10,
	});

	return rect;
};

export const setLimitChar = (canvas: fabric.Canvas, title: fabric.IText, background: fabric.Rect) => {
	title.on('editing:entered', () => {
		title.hiddenTextarea?.setAttribute('maxlength', '15');
	});
	const group = title.group;
	if (!group) return;
	title.on('changed', (e) => {
		console.log(group);
		background.set({ width: (title.get('width') || 0) + 10 });
		canvas.renderAll();
	});
};

export const addSection = (canvas: fabric.Canvas, x: number, y: number, fill: string) => {
	const id = v4();
	const sectionTitle = createSectionTitle({ objectId: id, text: 'SECTION', left: x, top: y });
	const sectionBackground = createTitleBackground({ objectId: id, left: x, top: y, color: fill });
	const backgroundRect = createRect({ objectId: id, left: x, top: y, color: fill });
	const section = createSection({
		objectId: id,
		left: x,
		top: y,
		sectionTitle,
		titleBackground: sectionBackground,
		backgroundRect,
	});

	setObjectEditEvent(canvas, section, sectionTitle);
	setLimitChar(canvas, sectionTitle, sectionBackground);
	section.sendBackwards(true);

	canvas.add(section);
};
