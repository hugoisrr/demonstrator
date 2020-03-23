import React, { useReducer } from 'react'
import DeviceContext from './deviceContext'
import DeviceReducer from './deviceReducer'
import {
	GET_DEVICE_WKS,
	SET_DEVICE_MAP,
	SET_CURRENT_DEVICE,
	GET_DEVICE_WEBSOCKET_STATUS,
} from '../types'

const DeviceState = props => {
	const initialState = {
		wks: [],
		wksMap: {},
		currentDevice: null,
		websocketStatus: '',
	}

	const [state, dispatch] = useReducer(DeviceReducer, initialState)

	// Set up Map data structure with workstations ids as keys and 50 Arrays fill with 0 as values
	const setUpDeviceMap = wks => {
		if (wks.length > 0) {
			const wksMap = new Map()
			wks.forEach(workstation => {
				wksMap.set(workstation.ws_id, new Array(20).fill(0))
			})
			dispatch({
				type: SET_DEVICE_MAP,
				payload: wksMap,
			})
		}
	}

	// Shift the first raw_values and puush the income raw_values on its corresponding array, within the device map structure
	const setDataInDeviceMap = data => {
		if (state.wksMap.size > 0) {
			for (const [wks_id, rawValuesArray] of state.wksMap.entries()) {
				if (data.ws_id === parseInt(wks_id)) {
					rawValuesArray.shift()
					rawValuesArray.push(data.raw_values)
				}
			}
		}
	}

	// Set current device id select from the dropdown
	const setCurrentDevice = wkId => {
		const deviceSelected = {}
		// Set workstation id and raw data keys from the wks array for the current Device
		state.wks.forEach(workstation => {
			if (wkId === workstation.ws_id) {
				deviceSelected['ws_id'] = wkId
				deviceSelected['raw_data'] = Object.values(workstation.raw_data)
			}
		})
		// Set raw values from the wksMap for the current Device
		for (const [ws_id, values] of state.wksMap.entries()) {
			if (parseInt(ws_id) === wkId) {
				deviceSelected['raw_values'] = values
			}
		}
		dispatch({
			type: SET_CURRENT_DEVICE,
			payload: deviceSelected,
		})
	}

	// Get Workstations from the API
	const getDeviceWks = wks => {
		dispatch({
			type: GET_DEVICE_WKS,
			payload: wks,
		})
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
				currentDevice: state.currentDevice,
				websocketStatus: state.websocketStatus,
				setUpDeviceMap,
				setCurrentDevice,
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
