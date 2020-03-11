export function percentage(partialValue, totalValue) {
	return (100 * partialValue) / totalValue
}

export function hexColorGenerator() {
	return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
}
