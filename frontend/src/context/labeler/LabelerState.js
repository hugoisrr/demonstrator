import React, { useReducer } from 'react'
import LabelerContext from './labelerContext'
import LabelerReducer from './labelerReducer'
import {
	GET_LABELER_WKS,
	SET_LABELER_MAP,
	SET_LABELER_COLORS,
	SET_LABELER_FLEX_VALUES,
	GET_LABELER_WEBSOCKET_STATUS,
} from '../types'
import { getRandColor } from '../../assets/libs/helperFunctions'

const LabelerState = props => {
	const initialState = {
		wks: [],
		wksMap: {},
		wksStatesColors: {},
		flexValues: {},
		websocketStatus: '',
	}

	const [state, dispatch] = useReducer(LabelerReducer, initialState)

	// Set up Map data structure with workstations ids as keys and 20 Arrays fill with -1 as values
	const setUpLabelerMap = wks => {
		if (wks.length > 0) {
			const wksMap = new Map()
			wks.forEach(workstation => {
				wksMap.set(workstation.ws_id, new Array(20).fill(-1))
			})
			dispatch({
				type: SET_LABELER_MAP,
				payload: wksMap,
			})
		}
	}

	const setLabelerStatesColors = wks => {
		if (wks.length > 0) {
			const wksStatesColors = new Map()
			wks.forEach(workstation => {
				const colorStates = {}
				Object.values(workstation.states).forEach(state => {
					colorStates[state] = getRandColor(5)
				})
				wksStatesColors.set(workstation.ws_id, colorStates)
			})
			dispatch({
				type: SET_LABELER_COLORS,
				payload: wksStatesColors,
			})
		}
	}

	// Shift the first state_key values and push the income state_key values on its corresponding array, within the labeler map structure
	const setDataInLabelerMap = data => {
		if (state.wksMap.size > 0) {
			for (const [wks_id, stateKeyValuesArray] of state.wksMap.entries()) {
				if (data.ws_id === parseInt(wks_id)) {
					stateKeyValuesArray.shift()
					stateKeyValuesArray.push(data.state_key)
				}
			}
		}
	}

	// Get WebsocketStatus
	const getLabelerWebsocketStatus = status => {
		dispatch({
			type: GET_LABELER_WEBSOCKET_STATUS,
			payload: status,
		})
	}

	// Get List of Workstations
	const getLabelerWks = wks => {
		dispatch({
			type: GET_LABELER_WKS,
			payload: wks,
		})
	}

	const setUpLabelerFlexValues = wks => {
		if (wks.length > 0) {
			const flexValuesMap = new Map()
			wks.forEach(workstation => {
				flexValuesMap.set(workstation.ws_id, [])
			})
			dispatch({
				type: SET_LABELER_FLEX_VALUES,
				payload: flexValuesMap,
			})
		}
	}

	const setFlexValuesInLabelerFlexValues = (wksId, flexValues) => {
		if (state.flexValues.size > 0) {
			for (const [wks_id, flexValuesArray] of state.flexValues.entries()) {
				if (wksId === parseInt(wks_id)) {
					flexValuesArray.length = 0
					flexValuesArray.push.apply(flexValuesArray, flexValues)
				}
			}
		}
	}

	return (
		<LabelerContext.Provider
			value={{
				wks: state.wks,
				wksMap: state.wksMap,
				wksStatesColors: state.wksStatesColors,
				flexValues: state.flexValues,
				websocketStatus: state.websocketStatus,
				setUpLabelerMap,
				setLabelerStatesColors,
				setDataInLabelerMap,
				getLabelerWebsocketStatus,
				setUpLabelerFlexValues,
				getLabelerWks,
				setFlexValuesInLabelerFlexValues,
			}}
		>
			{props.children}
		</LabelerContext.Provider>
	)
}

export default LabelerState
