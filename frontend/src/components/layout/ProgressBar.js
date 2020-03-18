/**
 * ProgressBar
 * Description - One big useEffect() runs for every data received.
 * To calculate the porcentage a Map data structure is created, which is called
 * counterStates, first it's initialize with the states's ids and with an empty array,
 * then for each data received verifies the id the state received with the state id of the
 * counterStates Map object, if both are equal then it's been push to the array.
 * Then it calculates the total of all entries, of all the states. After that we calculate
 * the percentage of each state, after getting the percentage, we had to converte the value into
 * decimal values, example: 20% -> 0.2, 55% -> 0.5. Because JSX doesn't accept percentage values to
 * render the ProgressBar. The file receives as a prop the statesColors, which is an array. To render
 * the proper color it verifies the array's index and the state's id.
 */

import React, { Fragment, useEffect, useState } from 'react'
import { percentage } from '../../assets/libs/helperFunctions'
import PropTypes from 'prop-types'

const ProgressBar = ({ states, data, statesColors }) => {
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
		setFlexValues(values)
		// console.log('total:', total)
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
								color: 'darkslategray',
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
