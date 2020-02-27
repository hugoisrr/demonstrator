import React, { useReducer } from 'react'

import ModelContext from './modelContext'
import ModelReducer from './modelReducer'
import { GET_MODEL_DATA, GET_MODEL_WKS } from '../types'

const ModelState = props => {
	const initialState = {
		data: {},
		wks: [],
	}

	const [state, dispatch] = useReducer(ModelReducer, initialState)

	// Get Model Data
	const getModelData = messageData => {
		dispatch({
			type: GET_MODEL_DATA,
			payload: messageData,
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
				getModelData,
				getModelWks,
			}}
		>
			{props.children}
		</ModelContext.Provider>
	)
}

export default ModelState
