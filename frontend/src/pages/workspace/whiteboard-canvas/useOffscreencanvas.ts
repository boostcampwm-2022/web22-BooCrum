import { useRef, useEffect } from 'react';
import offcanvasWorker from 'worker/offcanvas.worker';
import { Position, ZoomPosition, CanvasSize } from './types/offscreencanvas.types';

function useOffscreencanvas(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const worker = useRef<Worker>();

	const initWorker = (workerModule: () => void) => {
		const code = workerModule.toString();
		console.log(code);
		const blob = new Blob([`(${code})()`]);
		return new Worker(URL.createObjectURL(blob));
	};

	useEffect(() => {
		const htmlCanvas = document.createElement('canvas');
		htmlCanvas.width = window.innerWidth;
		htmlCanvas.height = window.innerHeight;
		htmlCanvas.style.left = '0';
		htmlCanvas.style.top = '0';

		htmlCanvas.style.position = 'absolute';
		const offscreen = htmlCanvas.transferControlToOffscreen();
		const canvasContainer = document.querySelector('.canvas-container');
		canvasContainer?.insertBefore(htmlCanvas, canvasContainer.firstChild);

		worker.current = initWorker(offcanvasWorker);

		worker.current.postMessage({ type: 'init', canvas: offscreen }, [offscreen]);

		canvas.current?.on('canvas:move', function (e) {
			const position = e as unknown as Position;
			worker.current?.postMessage({ type: 'move', position });
		});

		canvas.current?.on('canvas:zoom', function (e) {
			const zoomPosition = e as unknown as ZoomPosition;
			worker.current?.postMessage({
				type: 'zoom',
				zoom: zoomPosition.zoom,
				position: {
					x: zoomPosition.x,
					y: zoomPosition.y,
				},
			});
		});

		canvas.current?.on('canvas:resize', function (e) {
			const size = e as unknown as CanvasSize;
			worker.current?.postMessage({ type: 'resize', size: size });
		});
	}, []);
}

export default useOffscreencanvas;
