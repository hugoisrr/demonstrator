import React, { useContext } from 'react'
import { VictoryLine } from 'victory'
import DeviceContext from '../../context/device/deviceContext'
import { extractColumn } from '../../assets/libs/helperFunctions'

export const DeviceGraph = ({ sensorId }) => {
	const deviceContext = useContext(DeviceContext)
	const { currentDevice } = deviceContext
	const { raw_values } = currentDevice

	//Change the values into a format that Victorycharts can read it
	let data = extractColumn(raw_values, sensorId).map(value => {
		return { y: value }
	})

	return <VictoryLine style={{ data: { stroke: '#c43a31' } }} data={data} />
}
