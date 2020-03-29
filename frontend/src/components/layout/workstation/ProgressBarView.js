import React, { Fragment } from 'react'

export const ProgressBarView = ({ arrayValues, wsId, statesColors }) => {
	return (
		<Fragment>
			<h6 style={{ color: 'white' }}>Percentage:</h6>
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
