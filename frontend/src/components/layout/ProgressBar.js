import React from 'react'
import PropTypes from 'prop-types'

const ProgressBar = ({ states, data }) => {
	const counterStates = new Map()
	for (const [stateId] of Object.keys(states)) {
		counterStates.set(stateId, [])
	}
	data.forEach(element => {
		for (const [state_id, statesArray] of counterStates.entries()) {
			if (element === parseInt(state_id)) {
				statesArray.push(element)
			}
		}
	})
	let total = 0
	for (const [state_id, statesArray] of counterStates.entries()) {
		console.log(state_id, '->', statesArray.length)
		total += statesArray.length
	}
	console.log('total:', total)
	return <div>ProgressBar</div>
}

ProgressBar.propTypres = {
	states: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
}

export default ProgressBar
