import React from 'react'
import PropTypes from 'prop-types'

const ProgressBar = ({ states, data }) => {
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
	// According to the length of the array is the number of elements pushed and counts the total
	let total = 0
	for (const [state_id, statesArray] of counterStates.entries()) {
		console.log(state_id, '->', statesArray.length)
		total += statesArray.length
	}
	console.log('total:', total)
	return (
		<div className='progress'>
			<div
				className='progress-bar progress-bar-success'
				role='progressbar'
				style={{ flex: 0.4 }}
			>
				Free Space
			</div>
			<div
				className='progress-bar progress-bar-warning'
				role='progressbar'
				style={{ flex: 0.1 }}
			>
				Warning
			</div>
			<div
				className='progress-bar progress-bar-danger'
				role='progressbar'
				style={{ flex: 0.2 }}
			>
				Danger
			</div>
		</div>
	)
}

ProgressBar.propTypres = {
	states: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
}

export default ProgressBar
