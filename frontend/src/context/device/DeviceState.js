//Storing and providing data to the whole component tree
import React, { useReducer, useRef } from 'react'
import DeviceContext from './deviceContext'
import DeviceReducer from './deviceReducer'
import { GET_DEVICE_DATA, GET_DEVICE_WKS } from '../types'

const DeviceState = props => {
	const refInit = useRef(true)

	const initialState = {
		data: {},
		wks: [],
		dictionary: {},
	}

	const [state, dispatch] = useReducer(DeviceReducer, initialState)

	const startDictionary = () => {
		if (refInit.current) {
			state.wks.forEach(element => {
				state.dictionary[element.ws_id] = new Array(10).fill(0)
				refInit.current = false
			})
		}
	}

	const pushToDictionary = data => {
		state.dictionary[data.ws_id].shift()
		state.dictionary[data.ws_id].push(Object.values(data.raw_values))
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
				startDictionary,
				pushToDictionary,
				getDeviceData,
				getDeviceWks,
			}}
		>
			{props.children}
		</DeviceContext.Provider>
	)
}

export default DeviceState
