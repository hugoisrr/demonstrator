import React, { useReducer } from 'react'
import DeviceContext from './deviceContext'
import DeviceReducer from './deviceReducer'
import { GET_DEVICE_DATA, SET_LOADING, GET_DEVICE_WKS } from '../types'

const DeviceState = props => {
	const initialState = {
		data: [],
		wks: [],
		loading: false,
	}

	const [state, dispatch] = useReducer(DeviceReducer, initialState)

	// Get Device Data
	const getDeviceData = messageData => {
		setLoading()

		dispatch({
			type: GET_DEVICE_DATA,
			payload: messageData,
		})
	}

	const getDeviceWks = wks => {
		setLoading()
		dispatch({
			type: GET_DEVICE_WKS,
			payload: wks,
		})
	}

	// Set Loading
	const setLoading = () => dispatch({ type: SET_LOADING })

	return (
		<DeviceContext.Provider
			value={{
				data: state.data,
				wks: state.wks,
				loading: state.loading,
				getDeviceData,
				getDeviceWks,
			}}
		>
			{props.children}
		</DeviceContext.Provider>
	)
}

export default DeviceState
