import React from 'react'
import PropTypes from 'prop-types'
import { percentage } from '../../assets/libs/helperFunctions'

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
	// According to the length of the array ,is the number of elements pushed and counts the total
	let total = 0
	for (const statesArray of counterStates.values()) {
		total += statesArray.length
	}
	// Calculates the percentage of state
	let percentageValue = 0
	let flexValue = 0
	for (const [state_id, statesArray] of counterStates.entries()) {
		percentageValue = percentage(statesArray.length, total).toFixed(2)
		if (percentageValue === 'NaN' || percentageValue === 'Infinity')
			percentageValue = 0
		flexValue = (percentageValue / 100).toFixed(1)
		console.log(
			state_id,
			'->',
			statesArray.length,
			'->',
			percentageValue,
			'% ->',
			flexValue
		)
	}
	console.log('total:', total)

	return (
		<div className='progress'>
			<div
				className='progress-bar progress-bar-success'
				role='progressbar'
				style={{ flex: 0.4, backgroundColor: 'blue' }}
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
