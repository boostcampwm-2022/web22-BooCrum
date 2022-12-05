import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { colorChips } from '@data/workspace-object-color';
import { ObjectType } from './types';

function useEditMenu(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [selectedType, setSelectedType] = useState('');
	const [color, setColor] = useState(colorChips[0]);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!canvas.current) return;

		canvas.current.on('mouse:down', handleOutsideClick);
		canvas.current.on('object:modified', handleMenuPosition);
		canvas.current.on('mouse:wheel', handleMenuPosition);
		canvas.current.on('object:removed', handleRemoveObject);

		return () => {
			canvas.current?.off('mouse:down', handleOutsideClick);
			canvas.current?.off('object:modified', handleMenuPosition);
			canvas.current?.off('mouse:wheel', handleMenuPosition);
			canvas.current?.off('object:removed', handleRemoveObject);
		};
	}, [isOpen]);

	const openMenu = () => {
		const currentObject = canvas.current?.getActiveObject() as fabric.Group;
		const coord = currentObject?.getCoords();
		const top = coord ? coord[0].y - 40 : 0;
		const left = coord ? (coord[0].x + coord[1].x) / 2 - 30 : 0;

		if (currentObject._objects.length < 3) return;

		setSelectedType(currentObject.type);
		setColor(currentObject._objects[0].fill as string);
		setIsOpen(true);
		setMenuPosition({ x: left, y: top });
	};

	const handleOutsideClick = (opt: fabric.IEvent) => {
		if (!canvas.current) return;

		if (
			isOpen &&
			menuRef.current &&
			!menuRef.current.contains(opt.e.target as Node) &&
			!canvas.current.getActiveObject()
		)
			setIsOpen(false);
	};

	const handleMenuPosition = (opt: fabric.IEvent) => {
		if (!isOpen) return;
		const currentObject = canvas.current?.getActiveObject();
		const coord = currentObject?.getCoords();
		const top = coord ? coord[0].y - 40 : 0;
		const left = coord ? (coord[0].x + coord[1].x) / 2 - 30 : 0;
		setMenuPosition({ x: left, y: top });
	};
	const handleRemoveObject = (opt: fabric.IEvent) => {
		if (!isOpen) return;
		setIsOpen(false);
	};

	const setObjectColor = (color: string) => {
		const currentCanvas = canvas.current as fabric.Canvas;
		const currentGroup = currentCanvas.getActiveObject() as fabric.Group;

		const [backgroundRect, ...currentObjects] = currentGroup._objects;
		if (!backgroundRect || currentObjects.length < 2) return;

		if (backgroundRect) backgroundRect.fill = color;
		if (currentGroup.type === ObjectType.section) currentObjects[0].fill = color;

		setColor(color);

		currentCanvas.renderAll();
	};

	return { isOpen, menuRef, color, setObjectColor, selectedType, openMenu, menuPosition };
}

export default useEditMenu;
