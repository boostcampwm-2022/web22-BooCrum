import { useRef, useEffect } from 'react';
import { isUndefined } from '@utils/type.utils';
import { ServerToClientEvents, ClientToServerEvents, ObjectDataToServer } from './types';
import { Socket } from 'socket.io-client';

function useObjectWorker(
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
		worker.current.onmessage = ({ data }: { data: ObjectDataToServer }) => {
			socket.current?.emit('updating_object', data);
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

export default useObjectWorker;
