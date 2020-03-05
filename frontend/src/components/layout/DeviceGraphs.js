//Graphic component for each of the graphs needed for the device API
import React from 'react'
import { Spinner } from './Spinner'
import DeviceGraphWks from './DeviceGraphWks'

export default function DeviceGraphs(props) {
	if (!props.show) {
		return null
	}

	if (props.data.length > 0) {
		return (
			<div>
				<div id='chart'></div>
				<h2>Graph here with id: {props.id}</h2>
				<div>
					{Object.values(props.keyNames).map((item, i) => {
						return (
							<div key={i}>
								<DeviceGraphWks
									legendName={item}
									points={props.data.map((value, index) => {
										if (value === 0) {
											return value
										} else {
											return value[i]
										}
									})}
								/>
							</div>
						)
					})}
				</div>
			</div>
		)
	} else {
		return <Spinner />
	}
}
