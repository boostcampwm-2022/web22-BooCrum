interface ContextMenuProps {
	isOpen: boolean;
	menuRef: React.RefObject<HTMLDivElement>;
	children: React.ReactNode;
}
interface DeleteModalProps {
	closeModal: () => void;
}
interface RenameModalProps {
	closeModal: () => void;
	workspaceName: string;
}
interface ModalProps {
	isOpen: boolean;
	modalRef: React.RefObject<HTMLDivElement>;
	children: React.ReactNode;
}
