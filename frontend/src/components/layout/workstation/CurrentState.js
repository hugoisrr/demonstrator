/**
 * CurrentState
 * Description - This component is called by the WorkStationCard and its purpose is
 * display the current state of each Workstation, it verifies the current by checking
 * the stateId, it also displays the state's color.
 */

import React, { Fragment, useState, useEffect } from 'react'

export const CurrentState = ({ statesColors, dataValues, states }) => {
	const [currentState, setCurrentState] = useState('null')
	const [stateColor, setStateColor] = useState()

	// Set current state name and state's color of each workstation
	useEffect(() => {
		dataValues.forEach(stateValue => {
			for (const [stateId, stateName] of Object.entries(states)) {
				if (stateValue === parseInt(stateId)) {
					setCurrentState(stateName)
					setStateColor(statesColors[parseInt(stateId)])
				}
			}
		})
	})

	return (
		<Fragment>
			<h1 className='display-3 text-center bold' style={{ color: stateColor }}>
				{currentState}
			</h1>
		</Fragment>
	)
}
