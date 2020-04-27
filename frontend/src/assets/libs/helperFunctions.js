export function percentage(partialValue, totalValue) {
	return (100 * partialValue) / totalValue
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

// Function that calculates Flex values to render the length of each bar in the ProgressBar
export function calculateFlexValues(states, data) {
	const counterStates = new Map()
	// Assigns states id's as keys and empty arrays as values
	for (const [stateId] of Object.keys(states)) {
		counterStates.set(stateId, [])
	}

	// For each state id an element of the data in been pushed into an empty array
	data.forEach(element => {
		for (const [state_id, statesArray] of counterStates.entries()) {
			if (element === parseInt(state_id)) {
				statesArray.push(element)
			}
		}
	})
	// According to the length of the array, is the number of elements pushed and counts the total
	let total = 0
	for (const statesArray of counterStates.values()) {
		total += statesArray.length
	}
	// Calculates the percentage of each state
	let percentageValue = 0
	let flexValue = 0
	const values = []
	// NOTE to verify the percentage and the states uncomment the next lines
	// for (const [state_id, statesArray] of counterStates.entries()) {
	for (const statesArray of counterStates.values()) {
		percentageValue = percentage(statesArray.length, total).toFixed(2)
		if (percentageValue === 'NaN' || percentageValue === 'Infinity')
			percentageValue = 0
		flexValue = (percentageValue / 100).toFixed(1)
		values.push(flexValue)
		// console.log(
		// 	state_id,
		// 	'->',
		// 	statesArray.length,
		// 	'->',
		// 	percentageValue,
		// 	'% ->',
		// 	flexValue
		// )
	}

	return values
}
