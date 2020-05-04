import React, { Fragment } from 'react'

const SignalList = ({ signalArray }) => {
	console.log('signalArray:', signalArray)
	return (
		<Fragment>
			<td>
				<DeviceCircle color='red' />
			</td>
			<td>
				<DeviceCircle color='red' />
			</td>
			<td>
				<DeviceCircle color='green' />
			</td>
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
			/>
		</svg>
	)
}

export default SignalList
