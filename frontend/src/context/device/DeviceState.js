import React, { useReducer } from 'react'
import DeviceContext from './deviceContext'
import DeviceReducer from './deviceReducer'
import {
	GET_DEVICE_WKS,
	SET_DEVICE_MAP,
	GET_DEVICE_WEBSOCKET_STATUS,
} from '../types'

const DeviceState = props => {
	const initialState = {
		wks: [],
		wksMap: {},
		websocketStatus: '',
	}

	const [state, dispatch] = useReducer(DeviceReducer, initialState)

	// Set up Map data structure with workstations ids as keys and with empty arrays as values
	const setUpDeviceMap = wks => {
		if (wks.length > 0) {
			const wksMap = new Map()
			wks.forEach(workstation => {
				wksMap.set(workstation.ws_id, [])
			})
			dispatch({
				type: SET_DEVICE_MAP,
				payload: wksMap,
			})
		}
	}

	// Get Workstations from the API
	const getDeviceWks = wks => {
		dispatch({
			type: GET_DEVICE_WKS,
			payload: wks,
		})
	}

	// Set income raw_values on its corresponding array, within the device map structure
	const setDataInDeviceMap = data => {
		if (state.wksMap.size > 0) {
			for (const [wks_id, rawValuesArray] of state.wksMap.entries()) {
				if (data.ws_id === parseInt(wks_id)) {
					rawValuesArray.push(data.raw_values)
				}
			}
		}
	}

	// Get WebsocketStatus
	const getDeviceWebsocketStatus = status => {
		dispatch({
			type: GET_DEVICE_WEBSOCKET_STATUS,
			payload: status,
		})
	}

	return (
		<DeviceContext.Provider
			value={{
				wks: state.wks,
				wksMap: state.wksMap,
				websocketStatus: state.websocketStatus,
				setUpDeviceMap,
				getDeviceWks,
				setDataInDeviceMap,
				getDeviceWebsocketStatus,
			}}
		>
			{props.children}
		</DeviceContext.Provider>
	)
}

export default DeviceState
