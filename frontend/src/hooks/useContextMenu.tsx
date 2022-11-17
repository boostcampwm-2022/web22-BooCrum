import { useEffect, useRef, useState } from 'react';

function useContextMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	const toggleOpen = (x: number, y: number) => {
		setIsOpen(!isOpen);
		setMenuPosition({ x: x, y: y });
	};

	const handleOutsideClick = (e: Event) => {
		const current = menuRef.current;
		if (isOpen && current && !current.contains(e.target as Node)) setIsOpen(false);
	};

	return { isOpen, menuRef, toggleOpen, menuPosition };
}

export default useContextMenu;
