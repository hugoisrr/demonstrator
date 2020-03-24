// Definition of the context function which are shared with all of the labeler components
import React, { useReducer, useRef } from 'react'

import LabelerContext from './labelerContext'
import LabelerReducer from './labelerReducer'
import {
	GET_LABELER_DATA,
	GET_LABELER_WKS,
	GET_LABELER_WEBSOCKET_STATUS,
} from '../types'

const LabelerState = props => {
	const refInit = useRef(true)
	const initialState = {
		data: {},
		wks: [],
		dictionary: {},
		websocketStatus: '',
	}

	const [state, dispatch] = useReducer(LabelerReducer, initialState)

	// create the dictionary for the gantt chart
	const startDictionary = () => {
		if (refInit.current) {
			state.wks.forEach(element => {
				state.dictionary[element.ws_id] = new Array(30).fill(-1)
				refInit.current = false
			})
		}
	}

	const pushToDictionary = data => {
		state.dictionary[data.ws_id].shift()
		state.dictionary[data.ws_id].push(data.state_key)
	}

	// Get Labeler Data
	const getLabelerData = messageData => {
		dispatch({
			type: GET_LABELER_DATA,
			payload: messageData,
		})
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

	return (
		<LabelerContext.Provider
			value={{
				data: state.data,
				wks: state.wks,
				dictionary: state.dictionary,
				websocketStatus: state.websocketStatus,
				getLabelerWebsocketStatus,
				startDictionary,
				pushToDictionary,
				getLabelerData,
				getLabelerWks,
			}}
		>
			{props.children}
		</LabelerContext.Provider>
	)
}

export default LabelerState
