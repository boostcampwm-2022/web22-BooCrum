import { useRef, useEffect } from 'react';
import offcanvasWorker from 'worker/offcanvas.worker';

function useOffscreencanvas() {
	const worker = useRef<Worker>();

	const initWorker = (workerModule: () => void) => {
		const code = workerModule.toString();
		console.log(code);
		const blob = new Blob([`(${code})()`]);
		return new Worker(URL.createObjectURL(blob));
	};

	useEffect(() => {
		const htmlCanvas = document.createElement('canvas');
		htmlCanvas.width = 500;
		htmlCanvas.height = 500;
		htmlCanvas.style.position = 'absolute';
		const offscreen = htmlCanvas.transferControlToOffscreen();
		const canvasContainer = document.querySelector('.canvas-container');
		canvasContainer?.insertBefore(htmlCanvas, canvasContainer.firstChild);

		worker.current = initWorker(offcanvasWorker);
		worker.current.postMessage({ canvas: offscreen }, [offscreen]);
	}, []);
}

export default useOffscreencanvas;
