import { useEffect, useRef } from 'react';
import { ContextMeueLayout } from './index.style';
function ContextMenu({ setOpenMenu }: ContextMenuProps) {
	const menuRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (e.target instanceof Element)
				if (menuRef.current && !menuRef.current.contains(e.target)) {
					setOpenMenu(false);
				}
		};

		document.addEventListener('mousedown', handler);
		return () => {
			document.removeEventListener('mousedown', handler);
		};
	});

	return (
		<>
			<ContextMeueLayout ref={menuRef}>
				<li>Open</li>
				<li>Rename</li>
				<li>Delete</li>
			</ContextMeueLayout>
		</>
	);
}

export default ContextMenu;
