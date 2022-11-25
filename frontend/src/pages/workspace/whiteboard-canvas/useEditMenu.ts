import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

function useEditMenu(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	const openMenu = (x: number, y: number) => {
		setIsOpen(!isOpen);
		setMenuPosition({ x: x, y: y });
	};

	const handleOutsideClick = (e: Event) => {
		if (!canvas.current) return;

		if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node) && !canvas.current.getActiveObject())
			setIsOpen(false);
	};

	return { isOpen, menuRef, openMenu, menuPosition };
}

export default useEditMenu;
