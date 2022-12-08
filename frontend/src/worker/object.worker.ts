import { ObjectDataToServer } from '@pages/workspace/whiteboard-canvas/types';

export default () => {
	let waitQueue: ObjectDataToServer[] = [];

	self.onmessage = ({ data }: { data: ObjectDataToServer }) => {
		waitQueue.push(data);
	};

	setInterval(() => {
		const data = batchQueue();
		if (data) {
			Object.keys(data).forEach((key) => {
				self.postMessage(data[key]);
			});
		}
	}, 33.4);

	const batchQueue = () => {
		if (waitQueue.length === 0) return;
		const taskQueue = waitQueue;
		waitQueue = [];

		const dataByObject: {
			[key: string]: ObjectDataToServer;
		} = {};
		taskQueue.forEach((item) => {
			if (dataByObject.hasOwnProperty(item.objectId)) {
				Object.assign(dataByObject[item.objectId], item);
			} else {
				dataByObject[item.objectId] = item;
			}
		});
		return dataByObject;
	};
};
