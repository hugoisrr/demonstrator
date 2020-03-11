import React, { useState, useEffect } from 'react'
import pure from 'recompose/pure'
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Legend,
	ResponsiveContainer,
} from 'recharts'

const DeviceGraphWks = props => {
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
			<ResponsiveContainer width='100%' height={200}>
				<LineChart data={data}>
					<Line
						name={props.legendName}
						type='monotone'
						dataKey='key'
						stroke='#14ffec'
						dot={false}
						isAnimationActive={false}
					/>
					{/* <CartesianGrid strokeDasharray='3 3' />
					<Legend />*/}
					{/* <XAxis type='number' domain={[0, 'auto']} />
					<YAxis /> */}
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default pure(DeviceGraphWks)
