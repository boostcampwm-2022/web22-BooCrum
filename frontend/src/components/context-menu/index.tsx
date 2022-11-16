import { ContextMeueLayout } from './index.style';
function ContextMenu({ isOpen, menuRef, children }: ContextMenuProps) {
	return <>{isOpen && <ContextMeueLayout ref={menuRef}>{children}</ContextMeueLayout>}</>;
}

export default ContextMenu;
