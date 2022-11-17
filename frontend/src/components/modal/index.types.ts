export interface ModalProps {
	isOpen: boolean;
	modalRef: React.RefObject<HTMLDivElement>;
	children: React.ReactNode;
	width?: number;
	height?: number;
}
