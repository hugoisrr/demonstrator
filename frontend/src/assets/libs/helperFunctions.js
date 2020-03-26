export function percentage(partialValue, totalValue) {
	return (100 * partialValue) / totalValue
}

export function hexColorGenerator() {
	return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
}

export function getRandColor(brightness) {
	// Six levels of brightness from 0 to 5, 0 being the darkest
	var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256]
	var mix = [brightness * 51, brightness * 51, brightness * 51] //51 => 255/5
	var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(
		function(x) {
			return Math.round(x / 2.0)
		}
	)
	return 'rgb(' + mixedrgb.join(',') + ')'
}

//Function that takes only the values of each sensor
export function extractColumn(values, sensor) {
	return values.map(x => {
		x === 0 ? (x = 0) : (x = x[sensor])
		return x
	})
}