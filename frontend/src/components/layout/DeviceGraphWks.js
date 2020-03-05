import React, { useState, useEffect } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts'

export default function DeviceGraphWks(props) {
	const [data, setData] = useState([{ key: 0 }])

	const transform = () => {
		const arr = props.points.map(item => {
			return { key: item }
		})
		return arr
	}
	useEffect(() => {
		setData(transform())
	}, [props.points])
	return (
		<div>
			<LineChart width={500} height={200} data={data}>
				<Line
					name={props.legendName}
					type='monotone'
					dataKey='key'
					stroke='#14ffec'
					isAnimationActive={false}
				/>
				<CartesianGrid strokeDasharray='3 3' />
				<Legend />
				<YAxis />
				<XAxis />
			</LineChart>
		</div>
	)
}
