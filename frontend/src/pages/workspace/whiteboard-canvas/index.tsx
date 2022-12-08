import { LoadingContainer, WhiteboardCanvasLayout } from './index.style';
import useCanvas from './useCanvas';
import useSocket from './useSocket';
import ContextMenu from '@components/context-menu';
import ObjectEditMenu from '../object-edit-menu';
import { useRecoilValue } from 'recoil';
import useCanvasToSocket from './useCanvasToSocket';
import { myInfoInWorkspaceState } from '@context/user';
import { workspaceRole } from '@data/workspace-role';
import useRoleEvent from './useRoleEvent';
import ExportModal from '../export-modal';
import Loading from '@components/loading';

function WhiteboardCanvas() {
	const { canvas } = useCanvas();
	const { socket, isEndInit } = useSocket(canvas);

	const { isOpen, menuRef, color, setObjectColor, fontSize, handleFontSize, selectedType, menuPosition } =
		useCanvasToSocket({ canvas, socket });
	useRoleEvent(socket);
	const myInfoInWorkspace = useRecoilValue(myInfoInWorkspaceState);

	return (
		<>
			<WhiteboardCanvasLayout>
				<canvas id="canvas"></canvas>
			</WhiteboardCanvasLayout>

			{myInfoInWorkspace.role !== workspaceRole.GUEST && (
				<ContextMenu isOpen={isOpen} menuRef={menuRef} posX={menuPosition.x} posY={menuPosition.y}>
					<ObjectEditMenu
						selectedObject={selectedType}
						color={color}
						setObjectColor={setObjectColor}
						fontSize={fontSize}
						setFontSize={handleFontSize}
					/>
				</ContextMenu>
			)}
			<ExportModal canvas={canvas} />

			{!isEndInit && (
				<LoadingContainer>
					<Loading />
				</LoadingContainer>
			)}
		</>
	);
}
export default WhiteboardCanvas;
