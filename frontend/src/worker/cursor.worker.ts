import { MousePointer } from '@pages/workspace/whiteboard-canvas/types';

export default () => {
	let waitQueue: MousePointer[] = [];

	self.onmessage = ({ data }: { data: MousePointer }) => {
		waitQueue.push(data);
	};

	setInterval(() => {
		const data = batchQueue();
		if (data) {
			self.postMessage(data);
		}
	}, 33.4);

	const batchQueue = () => {
		if (waitQueue.length === 0) return;
		const taskQueue = waitQueue;
		waitQueue = [];
		return {
			mouse: taskQueue[taskQueue.length - 1],
			queueLength: taskQueue.length,
		};
	};
};
