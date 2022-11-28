import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

function useEditMenu(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!canvas.current) return;

		canvas.current.on('mouse:down', handleOutsideClick);
		canvas.current.on('object:modified', handleMenuPosition);
		canvas.current.on('mouse:wheel', handleMenuPosition);

		return () => {
			canvas.current?.off('mouse:down', handleOutsideClick);
			canvas.current?.off('object:modified', handleMenuPosition);
			canvas.current?.off('mouse:wheel', handleMenuPosition);
		};
	}, [isOpen]);

	const openMenu = () => {
		const currentObject = canvas.current?.getActiveObject();
		const coord = currentObject?.getCoords();
		const top = coord ? coord[0].y - 40 : 0;
		const left = coord ? (coord[0].x + coord[1].x) / 2 - 30 : 0;

		setIsOpen(true);
		console.log(top, left);
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

	return { isOpen, menuRef, openMenu, menuPosition };
}

export default useEditMenu;
