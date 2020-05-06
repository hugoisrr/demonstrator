import React, { useReducer } from 'react'
import SidebarContext from './sidebarContext'
import SidebarReducer from './SidebarReducer'
import {
	GET_WKS_IDS_SIDEBAR,
	REMOVE_DUPLICATED_IDS_SIDEBAR,
	SET_WKS_IDS_MAP_SIDEBAR,
	SET_WKS_IDS_STATUS_ARRAY_SIDEBAR,
} from '../types'

const SidebarState = props => {
	const initialState = {
		wksId: [],
		wksIdsMap: {},
	}

	const [state, dispatch] = useReducer(SidebarReducer, initialState)

	/**
	 * This function is been called once the connection was stablish between the client
	 * and server and when we receive the first with the workstations objects
	 */

	const getWksIds = wks => {
		try {
			// Iterates through the array of workstations and gets their ids
			wks.forEach(workstation => {
				dispatch({
					type: GET_WKS_IDS_SIDEBAR,
					payload: workstation.ws_id,
				})
			})
			if (state.wksId.length > 0) {
				// removes duplicated ids if the same workstation is been called in different websockets
				dispatch({
					type: REMOVE_DUPLICATED_IDS_SIDEBAR,
					payload: state.wksId,
				})

				/**
				 * create a Map datastructure with the workstations Ids as keys and
				 * an Array with three elements filled with 0's
				 */

				const wksIdsMap = new Map()
				state.wksId.forEach(workstationId => {
					wksIdsMap.set(workstationId, new Array(3).fill(0))
				})
				dispatch({
					type: SET_WKS_IDS_MAP_SIDEBAR,
					payload: wksIdsMap,
				})
			}
		} catch (error) {
			console.error(error)
		}
	}

	/**
	 * This function is called every time a message it been received by the websocket
	 * client. depending of the source and workstation id from the data, it changes the
	 * value in the array to 1's, then it store the array within the Map object.
	 * The order of the Array indexes is as follow: valuesArray[model, device, labeler]
	 * @param data - is the message received from the websocket
	 * @param source - is the type of workstation, which can be Model, Labeler or Device
	 */

	const setDataInWksIdsMap = (data, source) => {
		try {
			if (state.wksIdsMap.size > 0) {
				const valuesArray = [0, 0, 0]
				switch (source) {
					case 'model':
						valuesArray[0] = 1
						break

					case 'device':
						valuesArray[1] = 1
						break

					case 'labeler':
						valuesArray[2] = 1
						break

					default:
						break
				}

				/**
				 * iterates through the Map object, when data with a workstation id is received
				 * it replace the previous array with the new array with the actual values.
				 * Then a copy of the Map structure is done to be stored within the state
				 */

				for (const [wks_id, signalValues] of state.wksIdsMap.entries()) {
					if (data.ws_id === parseInt(wks_id)) {
						signalValues.length = 0
						signalValues.push.apply(signalValues, valuesArray)
					}
				}
				const wksStatusIdsMap = new Map(state.wksIdsMap)
				dispatch({
					type: SET_WKS_IDS_STATUS_ARRAY_SIDEBAR,
					payload: wksStatusIdsMap,
				})
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<SidebarContext.Provider
			value={{
				wksId: state.wksId,
				wksIdsMap: state.wksIdsMap,
				getWksIds,
				setDataInWksIdsMap,
			}}
		>
			{props.children}
		</SidebarContext.Provider>
	)
}

export default SidebarState
