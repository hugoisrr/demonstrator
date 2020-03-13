import React, { Fragment, useEffect, useState } from 'react'
import { percentage } from '../../assets/libs/helperFunctions'
import PropTypes from 'prop-types'

const ProgressBar = ({ states, data, statesColors }) => {
	console.log('statesColors:', statesColors)
	const [flexValues, setFlexValues] = useState([])

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
		let flexValue = 0
		const values = []
		for (const statesArray of counterStates.values()) {
			percentageValue = percentage(statesArray.length, total).toFixed(2)
			if (percentageValue === 'NaN' || percentageValue === 'Infinity')
				percentageValue = 0
			flexValue = (percentageValue / 100).toFixed(1)
			values.push(flexValue)
		}
		setFlexValues(values)
	}, [data, flexValues, states])

	return (
		<Fragment>
			<h6 style={{ color: 'white' }}>Percentage:</h6>
			<div className='progress'>
				{flexValues.map((value, index) => {
					const percentage = value * 100
					return (
						<div
							className='progress-bar progress-bar-success'
							role='progressbar'
							style={{
								flex: value,
								color: 'gray',
								backgroundColor: statesColors[index],
							}}
						>
							{percentage}%
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
	statesColors: PropTypes.array.isRequired,
}

export default ProgressBar
