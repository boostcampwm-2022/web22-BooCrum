import { WhiteboardCanvasLayout } from './index.style';
import useCanvas from './useCanvas';
import useSocket from './useSocket';
import useContextMenu from '@hooks/useContextMenu';
import { useEffect } from 'react';
import ContextMenu from '@components/context-menu';
import ObjectEditMenu from '../objectEditMenu';
import { colorChips } from '@data/workspace-object-color';

function WhiteboardCanvas() {
	const { canvas } = useCanvas();
	const { socket } = useSocket(canvas);
	const { isOpen, menuRef, toggleOpen, menuPosition } = useContextMenu();

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

	// Object 추가 예시
	const addObj = () => {
		if (!canvas.current) return;
		const rect = new fabric.Rect({
			objectId: v4(),
			height: 280,
			width: 200,
			top: 100,
			left: 100,
			fill: 'yellow',
		});
		canvas.current.add(rect);
	};
	// Object 삭제 예시
	const clearObjects = () => {
		if (!canvas.current) return;
		canvas.current.forEachObject((obj) => {
			// 그리드 제외 하고 삭제
			if (!(obj instanceof fabric.Line)) canvas.current?.remove(obj);
		});
	};

	// object edit menu 초안 -> object를 선택했을 때 메뉴 뜨도록 추후 수정
	const openContextMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		toggleOpen(e.clientX, e.clientY);
	};

	// object color 수정 초안
	const [color, setColor] = useState(colorChips[0]); // 나중에 object의 color로 대체
	const setObjectColor = (color: string) => {
		setColor(color);
	};

	return (
		<>
			<button onClick={addObj}>add</button>
			<button onClick={clearObjects}>CLEAR</button>
			<button onClick={openContextMenu}>edit menu</button>
			<canvas id="canvas"></canvas>

			<ContextMenu isOpen={isOpen} menuRef={menuRef} posX={menuPosition.x} posY={menuPosition.y}>
				<ObjectEditMenu selectedObject="section" color={color} setObjectColor={setObjectColor} />
			</ContextMenu>
		</>
	);
}
export default WhiteboardCanvas;
