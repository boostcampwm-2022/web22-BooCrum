import { fabric } from 'fabric';
import useCanvas from './useCanvas';
import useSocket from './useSocket';
import { useEffect } from 'react';

function WhiteboardCanvas() {
	const { canvas } = useCanvas();

	const { socket } = useSocket(canvas);

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
	return (
		<>
			<button onClick={addObj}>add</button>
			<button onClick={clearObjects}>CLEAR</button>
			<canvas id="canvas"></canvas>
		</>
	);
}
export default WhiteboardCanvas;
