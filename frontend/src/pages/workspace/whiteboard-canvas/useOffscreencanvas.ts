import { IEvent } from 'fabric/fabric-impl';
import { useRef, useEffect } from 'react';
import offcanvasWorker from 'worker/offcanvas.worker';

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
			const coords = e as unknown as { x: number; y: number };
			worker.current?.postMessage({ type: 'move', coords: coords });
		});
	}, []);
}

export default useOffscreencanvas;
