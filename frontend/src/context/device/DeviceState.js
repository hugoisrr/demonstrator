/**
 * Example of an incomming data:
 * Array of Workstations
 * [
	 {"ws_id": 0, 
	  "ws_name": "device 1", 
	  "raw_data": {"0": "acc_x", "1": "acc_y", "2": "acc_z", "3": "gyr_x", "4": "gyr_y", "5": "gyr_z", "6": "mag_x", "7": "mag_y", "8": "mag_z", "9": "kar_x", "10": "kar_y", "11": "kar_z"}}, 
	 {"ws_id": 1, 
	  "ws_name": "device 3", 
	  "raw_data": {"0": "acc_x", "1": "acc_y", "2": "acc_z", "3": "gyr_x", "4": "gyr_y", "5": "gyr_z", "6": "mag_x", "7": "mag_y", "8": "mag_z", "9": "kar_x", "10": "kar_y", "11": "kar_z"}}
	]
 * Income data from each workstation
 * {"ws_id": 1, 
	"raw_values": {"0": 0.057618388637312924, "1": -0.01153903734222596, "2": -1.2407419824416677, "3": 0.1221798713706208, "4": -1.3126519264650334, "5": 0.3426336321320796, "6": -0.5275675628580304, "7": 1.4297197122922918, "8": -1.4212098431803522, "9": 0.5838004442950168, "10": 0.06856041810785807, "11": 0.2555163473003254}
   }
 * {"ws_id": 0, 
	"raw_values": {"0": 1.0425443646803108, "1": -1.4336064075682586, "2": -1.4787157222248195, "3": -0.3266913435779594, "4": 1.5474151392132922, "5": -0.002664369636917856, "6": -0.6871659478370933, "7": -0.3965194770355106, "8": 1.760123147258409, "9": 0.002987315110255899, "10": -0.23585225015021777, "11": 1.7196920839156917}
   }
 *
 */

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

	const setDataInDeviceMap = data => {
		const deviceMapKeys = [...state.wksMap.keys()]
		if (deviceMapKeys.length > 0) {
			for (const [wks_id, rawValuesArray] of state.wksMap.entries()) {
				if (data.ws_id === parseInt(wks_id)) {
					rawValuesArray.push(data)
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
