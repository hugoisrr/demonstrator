import React from 'react'

export default function DeviceGraphs(props) {
	if (!props.show) {
		return null
	}
	return (
		<div>
			<h2>Graph here with id: {props.id}</h2>
			<div>{props.data}</div>
			<div>{props.show}</div>
		</div>
	)
}
