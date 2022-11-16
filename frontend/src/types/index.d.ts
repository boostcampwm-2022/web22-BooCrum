interface ContextMenuProps {
	menuRef: React.RefObject<HTMLUListElement>;
	toggleOpen: () => void;
	workspacename: string;
}
interface DeleteModalProps {
	setOpenModal: SetterOrUpdater<{
		isOpen: boolean;
	}>;
}
interface RenameModalProps {
	setOpenModal: SetterOrUpdater<{
		isOpen: boolean;
	}>;
}
