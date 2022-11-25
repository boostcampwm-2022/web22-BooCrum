import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

function useEditMenu(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!canvas.current) return;

		canvas.current.on('mouse:down', handleOutsideClick);
		canvas.current.on('object:moving', handleMenuPosition);

		return () => {
			canvas.current?.off('mouse:down', handleOutsideClick);
			canvas.current?.off('object:moving', handleMenuPosition);
		};
	}, [isOpen]);

	const openMenu = () => {
		const currentObject = canvas.current?.getActiveObject();
		const width = currentObject?.width || 0;
		const top = currentObject?.top ? currentObject.top - 40 : 0;
		const left = currentObject?.left ? currentObject.left + width / 2 - 30 : 0;

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

		const width = opt.target?.width || 0;
		const top = opt.target?.top ? opt.target.top - 40 : 0;
		const left = opt.target?.left ? opt.target.left + width / 2 - 30 : 0;
		setMenuPosition({ x: left, y: top });
	};

	return { isOpen, menuRef, openMenu, menuPosition };
}

export default useEditMenu;
