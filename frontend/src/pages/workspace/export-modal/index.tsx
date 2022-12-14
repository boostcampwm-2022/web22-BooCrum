import Modal from '@components/modal';
import ToastMessage from '@components/toast-message';
import useModal from '@hooks/useModal';
import { useState, useEffect } from 'react';
import { ModalContent, ExportButton } from './index.style';
import { calcCanvasFullWidthAndHeight } from '../../../utils/fabric.utils';
import { useParams } from 'react-router-dom';

function ExportModal({ canvas }: { canvas: React.MutableRefObject<fabric.Canvas | null> }) {
	const { isOpenModal, modalRef, closeModal, openModal } = useModal();
	const [isExporting, setIsExporting] = useState(false);
	const [openToast, setOpenToast] = useState(false);
	const { workspaceId } = useParams();

	const handleClickExportButton = () => {
		if (!canvas.current) return;
		// 막기
		setIsExporting(true);
		setOpenToast(true);
		const coords = calcCanvasFullWidthAndHeight(canvas.current);
		let dataUrl;
		if (!coords.left || !coords.right || !coords.top || !coords.bottom) {
			dataUrl = canvas.current.toDataURL();
		} else {
			dataUrl = canvas.current.toDataURL({
				left: coords.left - 60,
				top: coords.top - 60,
				width: coords.right - coords.left + 120,
				height: coords.bottom - coords.top + 120,
			});
		}
		closeModal();
		setIsExporting(false);
		setOpenToast(false);
		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = 'boocrum_' + (workspaceId || 'export');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const openExportModal = () => {
		openModal();
	};

	useEffect(() => {
		document.addEventListener('export:open', openExportModal);

		return () => {
			document.removeEventListener('export:open', openExportModal);
		};
	}, []);

	return (
		<Modal isOpen={isOpenModal} modalRef={modalRef} closeModal={closeModal} title="Export" width={400} height={220}>
			<ModalContent>
				<div className="export-modal-text">파일을 추출하시겠습니까?</div>
				<ExportButton onClick={handleClickExportButton} disabled={isExporting}>
					Export
				</ExportButton>
			</ModalContent>
			{openToast && <ToastMessage bold={true} message="Exporting..." />}
		</Modal>
	);
}

export default ExportModal;
