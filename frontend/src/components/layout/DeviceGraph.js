// Object { 0: 0.8400716849882907, 1: 1.501868161863535, 2: 0.3933181900447074, 3: -3.103283418929302, 4: -0.2780437231630597, 5: -0.39397141621521364, 6: 0.8745769194677374, 7: -0.7581252615507758, 8: -0.41363551285691963, 9: -0.13802880813788165, … }
import React, { Fragment, useState, useEffect, useContext } from 'react'
import { VictoryLine, VictoryChart, VictoryTheme } from 'victory'
import DeviceContext from '../../context/device/deviceContext'

export const DeviceGraph = ({ values, sensor }) => {
	//Temporal fix to rerender charts on value entry. Must implement some type of useEffect instead
	const deviceContext = useContext(DeviceContext)
	/*
	const [data, setData] = useState([{ key: 0 }])
	const test = [
		{ y: 2 },
		{ y: 3 },
		{ y: 5 },
		{ y: 4 },
		{ y: 7 },
	] */
	
	//Function that takes only the values of each sensor
	function extractColumn(values, sensor) {
		return values.map(x => {
			(x === 0) ? x = 0 : x = x[sensor]
			return x
		})
	}
	
	//Change the values into a format that Victorycharts can read it
	var test2 = extractColumn(values, sensor).map(item => {
		return { y: item }
	})
	
	/* useEffect(() => {
		setData(test2)
	}, [test2]) */
	
	return (
/* 		<VictoryChart responsive={false} theme={VictoryTheme.material}>
 */			<VictoryLine
				style={{
					data: { stroke: '#c43a31' },
					/* parent: { border: '1px solid #ccc' }, */
				}}
				data={test2}
			/>
/* 		</VictoryChart>
 */	)
}




