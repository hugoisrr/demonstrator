import React, { Fragment } from 'react'

const SignalList = ({ signalArray }) => {
	return (
		<Fragment>
			{signalArray.map((signalValue, index) => {
				return (
					<td key={index}>
						<DeviceCircle color={signalValue === 1 ? 'green' : 'red'} />
					</td>
				)
			})}
		</Fragment>
	)
}

const DeviceCircle = ({ color }) => {
	return (
		<svg height='30' width='30'>
			<circle
				cx='15'
				cy='15'
				r='10'
				stroke='black'
				strokeWidth='2'
				fill={color}
				className='delay'
			/>
		</svg>
	)
}

export default SignalList
