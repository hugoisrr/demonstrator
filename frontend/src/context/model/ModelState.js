import React, { useReducer } from 'react'
import ModelContext from './modelContext'
import ModelReducer from './modelReducer'
import {
	GET_MODEL_WKS,
	SET_MODEL_MAP,
	SET_MODEL_COLORS,
	SET_MODEL_FLEX_VALUES,
	GET_MODEL_WEBSOCKET_STATUS,
} from '../types'
import { getRandColor } from '../../assets/libs/helperFunctions'

const ModelState = props => {
	const initialState = {
		wks: [],
		wksMap: {},
		wksStatesColors: {},
		flexValues: {},
		websocketStatus: '',
	}

	const [state, dispatch] = useReducer(ModelReducer, initialState)

	// Set up Map data structure with workstations ids as keys and 50 Arrays fill with -1 as values
	const setUpModelMap = wks => {
		try {
			if (wks.length > 0) {
				const wksMap = new Map()
				wks.forEach(workstation => {
					wksMap.set(workstation.ws_id, new Array(50).fill(-1))
				})
				dispatch({
					type: SET_MODEL_MAP,
					payload: wksMap,
				})
			}
		} catch (error) {
			console.error(error)
		}
	}

	// Creates a Map Data structure to store an object with an object holding all states and its corresponding color
	const setModelStatesColors = wks => {
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
					type: SET_MODEL_COLORS,
					payload: wksStatesColors,
				})
			}
		} catch (error) {
			console.error(error)
		}
	}

	// Shift the first state_key values and push the income state_key values on its corresponding array, within the labeler map structure
	const setDataInModelMap = data => {
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
	const getModelWebsocketStatus = status => {
		dispatch({
			type: GET_MODEL_WEBSOCKET_STATUS,
			payload: status,
		})
	}

	// Get Workstations from the API
	const getModelWks = wks => {
		dispatch({
			type: GET_MODEL_WKS,
			payload: wks,
		})
	}

	// Creates a Map data structure to store the flex values for the progressbar in each workstation
	const setUpModelFlexValues = wks => {
		try {
			if (wks.length > 0) {
				const flexValuesMap = new Map()
				wks.forEach(workstation => {
					flexValuesMap.set(workstation.ws_id, [])
				})
				dispatch({
					type: SET_MODEL_FLEX_VALUES,
					payload: flexValuesMap,
				})
			}
		} catch (error) {
			console.error(error)
		}
	}

	const setModelFlexValues = (wksId, flexValues) => {
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
		<ModelContext.Provider
			value={{
				wks: state.wks,
				wksMap: state.wksMap,
				wksStatesColors: state.wksStatesColors,
				modelFlexValues: state.flexValues,
				websocketStatus: state.websocketStatus,
				setUpModelMap,
				setModelStatesColors,
				setDataInModelMap,
				getModelWebsocketStatus,
				getModelWks,
				setUpModelFlexValues,
				setModelFlexValues,
			}}
		>
			{props.children}
		</ModelContext.Provider>
	)
}

export default ModelState
