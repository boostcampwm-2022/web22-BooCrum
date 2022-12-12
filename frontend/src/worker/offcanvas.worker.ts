export default () => {
	self.onmessage = ({ data }) => {
		const canvas = data.canvas as OffscreenCanvas;
		const ctx = canvas.getContext('2d');

		// const backgroundColor = 'blue';
		const backgroundColor = '#f1f1f1';
		if (!ctx) return;
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};
};
