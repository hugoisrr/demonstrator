import React, { useReducer } from 'react'
import SidebarContext from './sidebarContext'
import SidebarReducer from './SidebarReducer'
import {
	GET_WKS_IDS_SIDEBAR,
	REMOVE_DUPLICATED_IDS_SIDEBAR,
	SET_WKS_IDS_MAP_SIDEBAR,
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

	return (
		<SidebarContext.Provider
			value={{
				wksId: state.wksId,
				wksIdsMap: state.wksIdsMap,
				getWksIds,
			}}
		>
			{props.children}
		</SidebarContext.Provider>
	)
}

export default SidebarState
