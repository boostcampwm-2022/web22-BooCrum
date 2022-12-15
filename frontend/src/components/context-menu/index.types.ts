export interface ContextMenuProps {
	isOpen: boolean;
	menuRef: React.RefObject<HTMLDivElement>;
	children: React.ReactNode;
	posX: number;
	posY: number;
}
