import React, { Fragment, useEffect, useState } from 'react'
import { percentage } from '../../assets/libs/helperFunctions'
import PropTypes from 'prop-types'

const ProgressBar = ({ states, data }) => {
	const [percentageValues, setPercentageValues] = useState([])

	useEffect(() => {
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
		// Calculates the percentage of each state
		let percentageValue = 0
		const values = []
		for (const statesArray of counterStates.values()) {
			percentageValue = percentage(statesArray.length, total).toFixed(2)
			if (percentageValue === 'NaN' || percentageValue === 'Infinity')
				percentageValue = 0
			values.push(percentageValue)
		}
		setPercentageValues(values)
	}, [data, percentageValues, states])

	return (
		<Fragment>
			<h6 style={{ color: 'white' }}>Percentage:</h6>
			<div className='progress'>
				{percentageValues.map(value => {
					let flexValue = (value / 100).toFixed(1)
					return (
						<div
							className='progress-bar progress-bar-success'
							role='progressbar'
							style={{ flex: flexValue }}
						>
							{value}
						</div>
					)
				})}
			</div>
		</Fragment>
	)
}

ProgressBar.propTypres = {
	states: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
}

export default ProgressBar
