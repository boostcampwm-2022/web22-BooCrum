interface ContextMenuProps {
	setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
interface DeleteModalProps {
	setOpenModal: SetterOrUpdater<{
		isOpen: boolean;
	}>;
}
