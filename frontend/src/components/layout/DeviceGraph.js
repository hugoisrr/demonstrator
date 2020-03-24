import React, {
	useContext,
	useEffect,
	useState,
	useCallback,
	useMemo,
	useRef,
} from 'react'
import { VictoryLine } from 'victory'
// import DeviceContext from '../../context/device/deviceContext'

export const DeviceGraph = ({ values, sensor }) => {
	const [arrayData, setArrayData] = useState([])
	// const sensorId = useMemo(() => {
	// 	return sensor
	// }, [sensor])

	const arrayValues = useMemo(() => {
		return values
	}, [values])
	// const refData = useRef([])

	//Function that takes only the values of each sensor
	const extractColumn = useCallback((values, sensor) => {
		return values.map(x => {
			x === 0 ? (x = 0) : (x = x[sensor])
			return x
		})
	}, [])

	useEffect(() => {
		setArrayData(
			extractColumn(values, sensor).map(item => {
				return { y: item }
			})
		)
		// eslint-disable-next-line
	}, [extractColumn(values, sensor), values, sensor ])
	//Change the values into a format that Victorycharts can read it
	// useEffect(() => {
	// 	refData.current = extractColumn(values, sensor).map(item => {
	// 		return { y: item }
	// 	})
	// 	console.log(refData.current)
	// 	// eslint-disable-next-line
	// }, [extractColumn(values, sensor), values, sensor])

	if (arrayData.length > 0) {
		// console.log(dataGraph)
		return (
			// <h4>hola2</h4>
			<VictoryLine
				style={{
					data: { stroke: '#c43a31' },
					/* parent: { border: '1px solid #ccc' }, */
				}}
				data={arrayData}
			/>
		)
	}
	// Spinner for graphs
	return <h4>hola</h4>
}
