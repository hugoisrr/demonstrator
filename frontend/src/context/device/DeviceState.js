//Storing and providing data to the whole component tree
import React, { useReducer } from 'react'
import DeviceContext from './deviceContext'
import DeviceReducer from './deviceReducer'
import { GET_DEVICE_DATA, GET_DEVICE_WKS } from '../types'

const DeviceState = props => {
	const initialState = {
		data: {},
		wks: [],
	}

	const [state, dispatch] = useReducer(DeviceReducer, initialState)

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
				getDeviceData,
				getDeviceWks,
			}}
		>
			{props.children}
		</DeviceContext.Provider>
	)
}

export default DeviceState
