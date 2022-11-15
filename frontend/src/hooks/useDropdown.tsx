import { useEffect, useRef, useState } from 'react';

function useDropdown() {
	const [isActive, setIsActive] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	const toggleActive = () => {
		setIsActive(!isActive);
	};

	const handleOutsideClick = (e: Event) => {
		const current = dropdownRef.current;
		if (isActive && current && !current.contains(e.target as Node)) setIsActive(false);
	};

	return { isActive, dropdownRef, toggleActive };
}

export default useDropdown;
