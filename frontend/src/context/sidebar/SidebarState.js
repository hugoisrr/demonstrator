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

	const getWksIds = wks => {
		try {
			wks.forEach(workstation => {
				dispatch({
					type: GET_WKS_IDS_SIDEBAR,
					payload: workstation.ws_id,
				})
			})
			if (state.wksId.length > 0) {
				dispatch({
					type: REMOVE_DUPLICATED_IDS_SIDEBAR,
					payload: state.wksId,
				})
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

	const setDataInWksIdsMap = (data, source) => {
		try {
			if (state.wksIdsMap.size > 0) {
				const valuesArray = [0, 0, 0]
				source === 'model' ? (valuesArray[0] = 1) : (valuesArray[0] = 0)
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
