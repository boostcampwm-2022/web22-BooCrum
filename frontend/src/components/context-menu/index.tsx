import { ContextMeueLayout } from './index.style';
import { ContextMenuProps } from './index.types';
function ContextMenu({ isOpen, menuRef, children, posX, posY }: ContextMenuProps) {
	return (
		<>
			{isOpen && (
				<ContextMeueLayout ref={menuRef} posX={posX} posY={posY}>
					{children}
				</ContextMeueLayout>
			)}
		</>
	);
}

export default ContextMenu;
