import { WhiteboardCanvasLayout } from './index.style';
import useCanvas from './useCanvas';
import useSocket from './useSocket';
import { useEffect, useState } from 'react';
import ContextMenu from '@components/context-menu';
import ObjectEditMenu from '../object-edit-menu';
import { colorChips } from '@data/workspace-object-color';
import useEditMenu from './useEditMenu';

function WhiteboardCanvas() {
	const { canvas } = useCanvas();
	const { socket } = useSocket(canvas);
	const { isOpen, menuRef, openMenu, menuPosition } = useEditMenu(canvas);

	useEffect(() => {
		if (!canvas.current) return;

		canvas.current.on('object:added', (e) => {
			// todo object 추가 로직
			// socket.emit('create_object', { e });
			console.log(e);
		});

		canvas.current.on('object:removed', (e) => {
			console.log(e);
		});

		canvas.current.on('selection:created', (e) => {
			// todo select 로직
			console.log(e);
			openMenu();
		});

		canvas.current.on('selection:updated', (e) => {
			openMenu();
		});

		canvas.current.on('selection:cleared', (e) => {
			// todo unselect 로직
			console.log(e);
		});

		canvas.current.on('object:moving', (e) => {
			// todo object update 로직
			console.log(e);
		});

		canvas.current.on('object:scaling', (e) => {
			// todo object update 로직
			console.log(e);
		});
	}, []);

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
