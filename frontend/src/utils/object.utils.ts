import { colorChips } from '@data/workspace-object-color';
import { ObjectType } from '@pages/workspace/whiteboard-canvas/types';
import { fabric } from 'fabric';
import { v4 } from 'uuid';

export const addSection = (canvas: fabric.Canvas, x: number, y: number) => {
	canvas.add(
		new fabric.Rect({
			type: ObjectType.section,
			objectId: v4(),
			left: x,
			top: y,
			fill: colorChips[0],
			width: 400,
			height: 500,
			objectCaching: false,
			isSocketObject: false,
		})
	);
};

export const createNameLabel = (id: string, text: string, x: number, y: number) => {
	const defaultLeft = x + 10;
	const defaultTop = y + 275;
	const defaultFontSize = 15;

	const nameLabelText = new fabric.Text(text, {
		type: ObjectType.nameText,
		objectId: id,
		top: defaultTop,
		left: defaultLeft,
		fontSize: defaultFontSize,
		objectCaching: false,
		isSocketObject: false,
	});

	return nameLabelText;
};

export const createRect = (id: string, x: number, y: number, fill: string) => {
	const defaultWidth = 300;
	const defaultHeight = 300;

	const rect = new fabric.Rect({
		objectId: id,
		type: ObjectType.rect,
		left: x,
		top: y,
		fill: fill,
		width: defaultWidth,
		height: defaultHeight,
		objectCaching: false,
		isSocketObject: false,
	});

	return rect;
};

export const createTextBox = (id: string, x: number, y: number, fontSize: number, defaultText = 'Text...') => {
	const defaultTop = y + 10;
	const defaultLeft = x + 10;
	const defaultWidth = 280;

	const textbox = new fabric.Textbox(defaultText, {
		type: ObjectType.text,
		top: defaultTop,
		left: defaultLeft,
		objectId: id,
		width: defaultWidth,
		objectCaching: false,
		splitByGrapheme: true,
		fontSize: fontSize,
		isSocketObject: false,
	});

	return textbox;
};

export const createPostIt = (
	id: string,
	x: number,
	y: number,
	textBox: fabric.Textbox,
	nameLabel: fabric.Text,
	backgroundRect: fabric.Rect
) => {
	const postit = new fabric.Group([backgroundRect, textBox, nameLabel], {
		objectId: id,
		type: ObjectType.postit,
		left: x,
		top: y,
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

export const setPostItEditEvent = (canvas: fabric.Canvas, postit: fabric.Group, textBox: fabric.Textbox) => {
	const id = postit.objectId;

	const ungrouping = (items: fabric.Object[], activeObject: fabric.Group) => {
		activeObject._restoreObjectsState();
		canvas.remove(activeObject);
		for (let i = 0; i < items.length; i++) {
			canvas.add(items[i]);
			items[i].lockMovementX = true;
			items[i].lockMovementY = true;
		}

		if (items[1] instanceof fabric.Textbox) {
			canvas.setActiveObject(items[1]);
			items[1].enterEditing();
			items[1].selectAll();
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
		const grp = new fabric.Group(items, { objectId: id, type: ObjectType.postit, isSocketObject: false });
		canvas.add(grp);

		grp.on('mousedblclick', () => {
			ungrouping(items, grp);
		});
	});

	postit.on('mousedblclick', () => {
		const items = postit._objects;
		ungrouping(items, postit);
	});
};

export const setPreventResizeEvent = (canvas: fabric.Canvas) => {
	canvas.on('object:scaling', (e) => {
		if (!(e.target instanceof fabric.Group)) return;
		const objs = e.target._objects;

		objs.forEach((obj) => {
			if (obj instanceof fabric.Textbox || obj instanceof fabric.Text) {
				const group = e.target;
				const width = (group?.getScaledWidth() || 1) - 20 * (group?.scaleX || 1);
				const scaleX = 1 / (group?.scaleX || 1);
				const scaleY = 1 / (group?.scaleY || 1);
				obj.set({ scaleX: scaleX, scaleY: scaleY, width: width });
				obj.fire('changed');
			}
		});
	});
};

export const addPostIt = (canvas: fabric.Canvas, x: number, y: number, fontSize: number, fill: string) => {
	const id = v4();
	const nameLabel = createNameLabel(id, 'NAME', x, y);
	const textBox = createTextBox(id, x, y, fontSize);
	const backgroundRect = createRect(id, x, y, fill);
	const postit = createPostIt(id, x, y, textBox, nameLabel, backgroundRect);

	setLimitHeightEvent(canvas, textBox, backgroundRect);
	setPostItEditEvent(canvas, postit, textBox);
	setPreventResizeEvent(canvas);

	canvas.add(postit);
};

export const setEditMenu = (object: fabric.Object) => {
	const width = object?.width || 0;
	const top = object?.top ? object.top - 50 : 0;
	const left = object?.left ? object.left + width / 2 : 0;

	return [left, top];
};
