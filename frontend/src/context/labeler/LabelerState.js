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

	// Set up Map data structure with workstations ids as keys and 50 Arrays fill with -1 as values
	const setUpLabelerMap = wks => {
		try {
			if (wks.length > 0) {
				const wksMap = new Map()
				wks.forEach(workstation => {
					wksMap.set(workstation.ws_id, new Array(50).fill(-1))
				})
				dispatch({
					type: SET_LABELER_MAP,
					payload: wksMap,
				})
			}
		} catch (error) {
			console.error(error)
		}
	}

	// Creates a Map Data structure to store an object with an object holding all states and its corresponding color
	const setLabelerStatesColors = wks => {
		try {
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
		} catch (error) {
			console.error(error)
		}
	}

	// Shift the first state_key values and push the income state_key values on its corresponding array, within the labeler map structure
	const setDataInLabelerMap = data => {
		try {
			if (state.wksMap.size > 0) {
				for (const [wks_id, stateKeyValuesArray] of state.wksMap.entries()) {
					if (data.ws_id === parseInt(wks_id)) {
						stateKeyValuesArray.shift()
						stateKeyValuesArray.push(data.state_key)
					}
				}
			}
		} catch (error) {
			console.error(error)
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

	// Creates a Map data structure to store the flex values for the progressbar in each workstation
	const setUpLabelerFlexValues = wks => {
		try {
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
		} catch (error) {
			console.error(error)
		}
	}

	// Set new Flex Values in its corresponding workstation
	const setLabelerFlexValues = (wksId, flexValues) => {
		try {
			if (state.flexValues.size > 0) {
				for (const [wks_id, flexValuesArray] of state.flexValues.entries()) {
					if (wksId === parseInt(wks_id)) {
						flexValuesArray.length = 0
						flexValuesArray.push.apply(flexValuesArray, flexValues)
					}
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<LabelerContext.Provider
			value={{
				wks: state.wks,
				wksMap: state.wksMap,
				wksStatesColors: state.wksStatesColors,
				labelerFlexValues: state.flexValues,
				websocketStatus: state.websocketStatus,
				setUpLabelerMap,
				setLabelerStatesColors,
				setDataInLabelerMap,
				getLabelerWebsocketStatus,
				getLabelerWks,
				setUpLabelerFlexValues,
				setLabelerFlexValues,
			}}
		>
			{props.children}
		</LabelerContext.Provider>
	)
}

export default LabelerState
