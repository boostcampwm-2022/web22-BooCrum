import { WhiteboardCanvasLayout } from './index.style';
import useCanvas from './useCanvas';
import useSocket from './useSocket';
import { useState } from 'react';
import ContextMenu from '@components/context-menu';
import ObjectEditMenu from '../object-edit-menu';
import { colorChips } from '@data/workspace-object-color';
import { useRecoilValue } from 'recoil';
import useCanvasToSocket from './useCanvasToSocket';
import { myInfoInWorkspaceState } from '@context/user';
import { workspaceRole } from '@data/workspace-role';

function WhiteboardCanvas() {
	const { canvas } = useCanvas();
	const { socket } = useSocket(canvas);

	const { isOpen, menuRef, menuPosition } = useCanvasToSocket({ canvas, socket });
	const myInfoInWorkspace = useRecoilValue(myInfoInWorkspaceState);

	// object color 수정 초안
	const [color, setColor] = useState(colorChips[0]); // 나중에 선택된 object의 color로 대체 예정
	const setObjectColor = (color: string) => {
		setColor(color); // object의 color를 수정하는 로직으로 수정 예정
	};

	return (
		<>
			<WhiteboardCanvasLayout>
				<canvas id="canvas"></canvas>
			</WhiteboardCanvasLayout>

			{myInfoInWorkspace.role !== workspaceRole.GUEST && (
				<ContextMenu isOpen={isOpen} menuRef={menuRef} posX={menuPosition.x} posY={menuPosition.y}>
					<ObjectEditMenu selectedObject="section" color={color} setObjectColor={setObjectColor} />
				</ContextMenu>
			)}
		</>
	);
}
export default WhiteboardCanvas;
