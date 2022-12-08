import { useRef, useEffect } from 'react';
import { isUndefined } from '@utils/type.utils';
import { ServerToClientEvents, ClientToServerEvents } from './types';
import { Socket } from 'socket.io-client';
import { MousePointer } from '@pages/workspace/whiteboard-canvas/types';

function useCursorWorker(
	workerModule: () => void,
	socket: React.MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null>
) {
	const worker = useRef<Worker>();

	const initWorker = () => {
		const code = workerModule.toString();
		const blob = new Blob([`(${code})()`]);
		return new Worker(URL.createObjectURL(blob));
	};

	useEffect(() => {
		worker.current = initWorker();
		worker.current.onmessage = ({
			data: { mouse, queueLength },
		}: {
			data: { mouse: MousePointer; queueLength: number };
		}) => {
			socket.current?.emit('move_pointer', mouse);
		};

		worker.current.onerror = (error) => {
			console.log(error);
		};

		return () => {
			if (isUndefined(worker.current)) return;
			worker.current.terminate();
		};
	}, []);

	return {
		worker,
	};
}

export default useCursorWorker;
