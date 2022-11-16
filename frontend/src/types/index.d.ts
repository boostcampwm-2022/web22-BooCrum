interface ContextMenuProps {
	isOpen: boolean;
	menuRef: React.RefObject<HTMLDivElement>;
	children: React.ReactNode;
}
interface DeleteModalProps {
	toggleOpen: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
}
interface RenameModalProps {
	setOpenModal: SetterOrUpdater<{
		isOpen: boolean;
	}>;
}
