import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { colorChips } from '@data/workspace-object-color';
import { CanvasType, ObjectType } from './types';

function useEditMenu(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [selectedType, setSelectedType] = useState('');
	const [color, setColor] = useState(colorChips[0]);
	const [fontSize, setFontSize] = useState(40);

	const fontSizeRef = useRef<number>();
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!canvas.current) return;

		canvas.current.on('mouse:down', handleOutsideClick);
		canvas.current.on('object:modified', handleMenuPosition);
		canvas.current.on('mouse:wheel', handleMenuPosition);
		canvas.current.on('object:removed', handleRemoveObject);

		document.addEventListener('keydown', setPostItFontSize);
		document.addEventListener('focusin', setFontEditMode);
		document.addEventListener('focusout', removeFontEditMode);

		return () => {
			canvas.current?.off('mouse:down', handleOutsideClick);
			canvas.current?.off('object:modified', handleMenuPosition);
			canvas.current?.off('mouse:wheel', handleMenuPosition);
			canvas.current?.off('object:removed', handleRemoveObject);

			document.removeEventListener('keydown', setPostItFontSize);
			document.removeEventListener('focusin', setFontEditMode);
			document.removeEventListener('focusout', removeFontEditMode);
		};
	}, [isOpen]);

	const openMenu = () => {
		const currentObject = canvas.current?.getActiveObject() as fabric.Group;
		const coord = currentObject?.getCoords();
		const top = coord ? coord[0].y - 40 : 0;
		const left = coord ? (coord[0].x + coord[1].x) / 2 - 30 : 0;

		if (!(currentObject instanceof fabric.Group)) return;

		const backgroundRect = currentObject._objects[0] as fabric.Rect;

		if (currentObject.type === ObjectType.postit) {
			const currentText = currentObject._objects[1] as fabric.Text;

			fontSizeRef.current = currentText.fontSize;
			setFontSize(currentText.fontSize as number);
		}

		setSelectedType(currentObject.type);
		setColor(backgroundRect.fill as string);
		setIsOpen(true);
		setMenuPosition({ x: left, y: top });
	};

	const handleOutsideClick = (opt: fabric.IEvent) => {
		if (
			isOpen &&
			menuRef.current &&
			!menuRef.current.contains(opt.e.target as Node) &&
			!canvas.current?.getActiveObject()
		) {
			setIsOpen(false);
		}
	};

	const handleMenuPosition = () => {
		if (!isOpen) return;
		const currentObject = canvas.current?.getActiveObject();
		const coord = currentObject?.getCoords();
		const top = coord ? coord[0].y - 40 : 0;
		const left = coord ? (coord[0].x + coord[1].x) / 2 - 30 : 0;
		setMenuPosition({ x: left, y: top });
	};
	const handleRemoveObject = () => {
		if (!isOpen) return;
		setIsOpen(false);
	};

	const setObjectColor = (color: string) => {
		const currentCanvas = canvas.current as fabric.Canvas;
		if (!currentCanvas) return;

		const currentGroup = currentCanvas.getActiveObject() as fabric.Group;

		const [backgroundRect, ...currentObjects] = currentGroup._objects;
		if (!backgroundRect || currentObjects.length < 2) return;

		if (backgroundRect) backgroundRect.fill = color;
		if (currentGroup.type === ObjectType.section) currentObjects[0].fill = color;

		setColor(color);

		currentCanvas.fire('color:modified', { target: currentGroup });
		currentCanvas.requestRenderAll();
	};

	const setFontEditMode = () => {
		const currentCanvas = canvas.current as fabric.Canvas;
		if (!currentCanvas) return;

		currentCanvas.mode = CanvasType.edit;
	};

	const removeFontEditMode = () => {
		const currentCanvas = canvas.current as fabric.Canvas;
		if (!currentCanvas) return;

		currentCanvas.mode = CanvasType.select;
	};

	const handleFontSize = (e: ChangeEvent<HTMLInputElement>) => {
		const fontSizeNumber = Number(e.target.value);
		if (!isNaN(fontSizeNumber) && fontSizeNumber < 70) {
			setFontSize(fontSizeNumber);
			fontSizeRef.current = fontSizeNumber;
		}
	};

	const setPostItFontSize = (e: KeyboardEvent) => {
		if (e.key !== 'Enter') return;

		const currentCanvas = canvas.current as fabric.Canvas;
		if (!currentCanvas) return;

		const currentGroup = currentCanvas.getActiveObject() as fabric.Group;
		const textObject = currentGroup._objects[1] as fabric.Text;
		if (!textObject) return;

		textObject.fontSize = fontSizeRef.current;

		currentCanvas.fire('font:modified', { target: currentGroup });
		currentCanvas.requestRenderAll();
	};

	return { isOpen, menuRef, color, setObjectColor, fontSize, handleFontSize, selectedType, openMenu, menuPosition };
}

export default useEditMenu;
