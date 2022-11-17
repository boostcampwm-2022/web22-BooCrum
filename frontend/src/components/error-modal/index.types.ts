export interface ErrorModalProps {
	isOpen: boolean;
	errorMessage: string;
	modalRef: React.RefObject<HTMLDivElement>;
	width?: number;
	height?: number;
}
