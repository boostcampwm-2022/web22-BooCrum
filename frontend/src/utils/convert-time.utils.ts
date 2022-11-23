export function compareStringByMillisecond(a: string, b: string) {
	return new Date(b).getTime() - new Date(a).getTime();
}

export function setTimestamp(time: string): string {
	const updateDate = new Date(time).getTime();
	const currentDate = new Date().getTime();

	const minuteDiff = Math.floor(Math.abs((currentDate - updateDate) / (1000 * 60)));

	return setDateDiff(minuteDiff);
}

function setDateDiff(minuteDiff: number): string {
	if (Math.floor(minuteDiff / 60) < 1) {
		return `Edited ${minuteDiff} minutes ago`;
	} else if (Math.floor(minuteDiff / (60 * 24)) < 1) {
		return `Edited ${Math.floor(minuteDiff / 60)} hours age`;
	} else {
		return `Edited ${Math.floor(minuteDiff / (60 * 24))} days ago`;
	}
}
