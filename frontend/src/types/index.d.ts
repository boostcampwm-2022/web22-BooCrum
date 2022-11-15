interface ContextMenuProps {
	setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
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
