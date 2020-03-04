//Graphic component for each of the graphs needed for the device API
import React from 'react'
import { Spinner } from './Spinner'

export default function DeviceGraphs(props) {
	if (!props.show) {
		return null
	}
	/* console.log(props) */
	console.log(props.data)
	if (props.data.length > 0) {
		return (
			<div>
				<h2>Graph here with id: {props.id}</h2>
				<div>
					{Object.values(props.keyNames).map((item, i) => {
						return (
							<h3>
								{item} : {props.data.map((value, index) => value[i])}
							</h3>
						)
					})}
				</div>
			</div>
		)
	} else {
		return <Spinner />
	}
}
