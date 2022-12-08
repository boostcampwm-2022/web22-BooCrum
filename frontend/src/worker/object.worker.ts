export default () => {
	setInterval(() => {
		postMessage(Date.now());
	}, 1000);
};
