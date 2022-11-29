import { colorChips } from '@data/workspace-object-color';
import { fabric } from 'fabric';
import { v4 } from 'uuid';

export const addSection = (canvas: fabric.Canvas, x: number, y: number) => {
	canvas.add(
		new fabric.Rect({
			objectId: v4(),
			left: x,
			top: y,
			fill: colorChips[0],
			width: 400,
			height: 500,
			objectCaching: false,
		})
	);
};

export const addPostIt = (canvas: fabric.Canvas, x: number, y: number) => {
	const id = v4();

	const nameLabel = new fabric.Text('name', {
		top: y + 275,
		left: x + 10,
		objectId: id,
		width: 280,
		objectCaching: false,
		fontSize: 15,
	});
	const textbox = new fabric.Textbox('Text...', {
		top: y + 10,
		left: x + 10,
		objectId: id,
		width: 280,
		objectCaching: false,
		splitByGrapheme: true,
		fontSize: 40,
	});

	const backgroundRect = new fabric.Rect({
		objectId: id,
		left: x,
		top: y,
		fill: colorChips[0],
		width: 300,
		height: 300,
		objectCaching: false,
	});

	const postit = new fabric.Group([backgroundRect, textbox, nameLabel], {
		objectId: id,
		left: x,
		top: y,
		objectCaching: false,
	});

	textbox.on('changed', (e) => {
		if (!textbox.height || !textbox.fontSize || !backgroundRect.height) return;
		while (textbox.height > backgroundRect.height - 50 && textbox.fontSize > 12) {
			textbox.fontSize--;
			canvas.renderAll();
		}
	});

	textbox.on('editing:exited', () => {
		console.log('editing:exited');
		const items: fabric.Object[] = [];
		canvas.forEachObject(function (obj) {
			if (obj.objectId == id) {
				items.push(obj);
				canvas.remove(obj);
			}
		});
		const grp = new fabric.Group(items, { objectId: id });
		canvas.add(grp);

		grp.on('mousedblclick', (e) => {
			console.log(grp.objectId);
			const activeObject = grp;
			if (activeObject instanceof fabric.Group) {
				const items = activeObject._objects;
				activeObject._restoreObjectsState();
				canvas.remove(activeObject);
				console.log(items);
				for (let i = 0; i < items.length; i++) {
					canvas.add(items[i]);
					items[i].lockMovementX = true;
					items[i].lockMovementY = true;
				}
			}
			if (items[1] instanceof fabric.Textbox) {
				canvas.setActiveObject(items[1]);
				items[1].enterEditing();
				items[1].selectAll();
			}
		});
	});

	postit.on('mousedblclick', (e) => {
		const activeObject = postit;
		if (activeObject instanceof fabric.Group) {
			const items = activeObject._objects;
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
		}
	});

	canvas.add(postit);
};

export const setEditMenu = (object: fabric.Object) => {
	const width = object?.width || 0;
	const top = object?.top ? object.top - 50 : 0;
	const left = object?.left ? object.left + width / 2 : 0;

	return [left, top];
};
