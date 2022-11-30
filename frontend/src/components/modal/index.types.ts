export interface ModalProps {
	isOpen: boolean;
	closeModal: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
	children: React.ReactNode;
	title: string;
	width: number;
	height: number;
}
