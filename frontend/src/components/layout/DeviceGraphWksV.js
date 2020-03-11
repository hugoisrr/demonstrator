import React, { useState, useEffect } from 'react'
import pure from 'recompose/pure'
import { VictoryLine } from 'victory'
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Legend,
	ResponsiveContainer,
} from 'recharts'

const DeviceGraphWksV = props => {
	const [data, setData] = useState([{ key: 0 }])

	useEffect(() => {
		setData(
			props.points.map(item => {
				return { key: item }
			})
		)
	}, [props.points])
	return (
		<div>
			<VictoryLine
				style={{
					data: { stroke: '#c43a31' },
					parent: { border: '1px solid #ccc' },
				}}
				data={[
					{ x: 1, y: 2 },
					{ x: 2, y: 3 },
					{ x: 3, y: 5 },
					{ x: 4, y: 4 },
					{ x: 5, y: 7 },
				]}
			/>
		</div>
	)
}

export default pure(DeviceGraphWksV)
