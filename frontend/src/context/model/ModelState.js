import React, { useReducer, useRef } from 'react'
import ModelContext from './modelContext'
import ModelReducer from './modelReducer'
import {
	GET_MODEL_DATA,
	GET_MODEL_WKS,
	GET_MODEL_WEBSOCKET_STATUS,
} from '../types'

const ModelState = props => {
	const refInit = useRef(true)
	const initialState = {
		data: {},
		wks: [],
		dictionary: {},
		websocketStatus: '',
	}

	const [state, dispatch] = useReducer(ModelReducer, initialState)

	const startDictionary = () => {
		if (refInit.current) {
			state.wks.forEach(element => {
				state.dictionary[element.ws_id] = new Array(5).fill(-1)
				refInit.current = false
			})
		}
	}

	const pushToDictionary = data => {
		state.dictionary[data.ws_id].shift()
		state.dictionary[data.ws_id].push(data.state_key)
	}

	// Get Model Data
	const getModelData = messageData => {
		dispatch({
			type: GET_MODEL_DATA,
			payload: messageData,
		})
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

	return (
		<ModelContext.Provider
			value={{
				data: state.data,
				wks: state.wks,
				dictionary: state.dictionary,
				websocketStatus: state.websocketStatus,
				getModelWebsocketStatus,
				startDictionary,
				pushToDictionary,
				getModelData,
				getModelWks,
			}}
		>
			{props.children}
		</ModelContext.Provider>
	)
}

export default ModelState
