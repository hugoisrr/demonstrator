//Storing and providing data to the whole component tree
import React, { useReducer, useRef } from 'react'
import DeviceContext from './deviceContext'
import DeviceReducer from './deviceReducer'
import { GET_DEVICE_DATA, GET_DEVICE_WKS } from '../types'

const DeviceState = React.memo(props => {
	const refInit = useRef(true)

	const initialState = {
		data: {},
		wks: [],
		dictionary: {},
		dictionaryTest: {},
		currentWks: '',
		avg: {},
	}

	const [state, dispatch] = useReducer(DeviceReducer, initialState)

	const startDictionary = () => {
		if (refInit.current) {
			state.wks.forEach(element => {
				state.dictionary[element.ws_id] = [] /* new Array(300).fill(0) */
			})
			state.wks.forEach(element => {
				state.dictionaryTest[element.ws_id] = []
			})
			state.wks.forEach(element => {
				state.avg[element.ws_id] = [0]
				refInit.current = false
			})
		}
	}

	/* const createAverage = data => {
		if (state.average.length > 9) {
			state.average.reduce((a, b) => a + b, 0) / state.average.length
		}
	} */

	const pushToDictionary = data => {
		if (state.dictionary[data.ws_id].length > 399) {
			state.dictionary[data.ws_id] = [0]
		}
		/* state.dictionary[data.ws_id].shift() */
		state.dictionary[data.ws_id].unshift(Object.values(data.raw_values))
	}

	const average = id => {
		var tempArr = Object.keys(state.wks[0].raw_data).map((item, i) => {
			let arr = state.dictionaryTest[id].map(a => a[i])
			return arr.reduce((a, b) => a + b, 0) / arr.length
		})
		state.dictionaryTest[id].length = 0
		/* console.log(state.dictionaryTest)
		console.log(tempArr) */
		state.avg[id].shift()
		state.avg[id].push(Object.values(tempArr))
		//console.log(state.avg)
	}

	const pushToDictionaryTemp = data => {
		if (state.dictionaryTest[data.ws_id].length > 9) {
			average(data.ws_id)
		} else {
			state.dictionaryTest[data.ws_id].push(Object.values(data.raw_values))
		}
	}

	// Get device frequent data and store it
	const getDeviceData = messageData => {
		dispatch({
			type: GET_DEVICE_DATA,
			payload: messageData,
		})
	}

	// Get device workstations array and store it
	const getDeviceWks = wks => {
		state.currentWks = wks
		dispatch({
			type: GET_DEVICE_WKS,
			payload: wks,
		})
	}

	//Not rendered component that provides data to component tree
	return (
		<DeviceContext.Provider
			value={{
				data: state.data,
				wks: state.wks,
				dictionary: state.dictionary,
				avg: state.avg,
				startDictionary,
				pushToDictionary,
				getDeviceData,
				getDeviceWks,
				pushToDictionaryTemp,
			}}
		>
			{props.children}
		</DeviceContext.Provider>
	)
})

export default DeviceState
