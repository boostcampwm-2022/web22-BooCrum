import { useEffect, useRef, useState } from 'react';

function useContextMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	const handleOutsideClick = (e: Event) => {
		const current = menuRef.current;
		if (isOpen && current && !current.contains(e.target as Node)) setIsOpen(false);
	};

	return { isOpen, menuRef, toggleOpen };
}

export default useContextMenu;
