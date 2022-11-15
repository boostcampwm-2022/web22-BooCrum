import { useState } from 'react';

function useDropdown() {
	const [isActive, setIsActive] = useState(false);

	const handleActive = () => {
		setIsActive(true);
	};

	const handleInActive = () => {
		setIsActive(false);
	};

	const toggleActive = () => {
		setIsActive(!isActive);
	};

	return { isActive, handleActive, handleInActive, toggleActive };
}

export default useDropdown;
