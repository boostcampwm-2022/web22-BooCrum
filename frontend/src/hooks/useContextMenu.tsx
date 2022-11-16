import { useEffect, useRef, useState } from 'react';

function useContextMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
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
