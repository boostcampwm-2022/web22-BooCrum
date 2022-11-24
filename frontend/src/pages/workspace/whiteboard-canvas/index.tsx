import { WhiteboardCanvasLayout } from './index.style';
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
	return (
		<>
			<WhiteboardCanvasLayout>
				<canvas id="canvas"></canvas>
			</WhiteboardCanvasLayout>
		</>
	);
}
export default WhiteboardCanvas;
