/**
 * ProgressBarView
 * Description - For each workstation this component iterates the number of states
 * and gets the flex values to generate a progress bar corresponding for each
 * state, then it gets the color from the array StatesColors, it compares the index
 * of the arry to assig its corresponding color.
 */

import React, { Fragment } from 'react'

export const ProgressBarView = ({ arrayValues, wsId, statesColors }) => {
	return (
		<Fragment>
			<h3 className = "workstationcard">Percentage:</h3>
			<div className='progress'>
				{arrayValues.get(wsId).map((value, index) => {
					const percentage = value * 100
					return (
						<div
							className='progress-bar'
							key={index}
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
