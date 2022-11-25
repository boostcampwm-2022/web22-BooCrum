import { WhiteboardCanvasLayout } from './index.style';
import { fabric } from 'fabric';
import useCanvas from './useCanvas';
import useSocket from './useSocket';
import { useEffect, useState } from 'react';
import ContextMenu from '@components/context-menu';
import ObjectEditMenu from '../object-edit-menu';
import { colorChips } from '@data/workspace-object-color';
import { toolItems } from '@data/workspace-tool';
import { useRecoilValue } from 'recoil';
import { cursorState } from '@context/workspace';
import useCanvasToSocket from './useCanvasEvent';

function WhiteboardCanvas() {
	const { canvas } = useCanvas();
	const { socket } = useSocket(canvas);

	const { isOpen, menuRef, menuPosition } = useCanvasToSocket({ canvas, socket });
	const cursor = useRecoilValue(cursorState);

	useEffect(() => {
		if (!canvas.current) return;

		const fabricCanvas = canvas.current as fabric.Canvas;
		if (cursor.type === toolItems.MOVE) {
			fabricCanvas.defaultCursor = 'grab';
			fabricCanvas.selection = false;
		} else if (cursor.type === toolItems.SECTION || cursor.type === toolItems.POST_IT) {
			fabricCanvas.defaultCursor = 'context-menu';
			fabricCanvas.selection = true;
		} else {
			fabricCanvas.defaultCursor = 'default';
			fabricCanvas.selection = true;
		}
		// grab 상태에서 화면 움직이는 경우 grabbing으로 수정하는 부분 추가 필요
	}, [cursor]);

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

			<ContextMenu isOpen={isOpen} menuRef={menuRef} posX={menuPosition.x} posY={menuPosition.y}>
				<ObjectEditMenu selectedObject="section" color={color} setObjectColor={setObjectColor} />
			</ContextMenu>
		</>
	);
}
export default WhiteboardCanvas;
