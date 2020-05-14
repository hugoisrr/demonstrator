/**
 * SignalList
 * Description - This component receives an Array with the Signal values of each
 * workstation, then we iterates through the array and check the values, if the value
 * is 1 then it will render a green circule, if the value is 0 it renders a red circle
 */

import React, { Fragment } from 'react'

const SignalList = ({ signalArray }) => {
	return (
		<Fragment>
			{signalArray.map((signalValue, index) => {
				return (
					<td key={index}>
						<DeviceCircle color={signalValue === 1 ? 'red' : 'green'} />
					</td>
				)
			})}
		</Fragment>
	)
}

// DeviceCircle component that receives the color as a prop, using CSS transition it delays the color
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
