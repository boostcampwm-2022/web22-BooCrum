import { fabric } from 'fabric';
import useCanvas from './useCanvas';

function WhiteboardCanvas() {
	const { canvas } = useCanvas();

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
