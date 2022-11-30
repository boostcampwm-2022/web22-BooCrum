export interface ErrorModalProps {
	isOpen: boolean;
	errorMessage: string;
	closeModal: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
	width?: number;
	height?: number;
}
