import React, { useReducer } from 'react'

import ModelContext from './modelContext'
import ModelReducer from './modelReducer'
import { GET_MODEL_DATA, SET_LOADING, GET_MODEL_WKS } from '../types'

const ModelState = props => {
	const initialState = {
		data: [],
		wks: [],
		loading: false,
	}

	const [state, dispatch] = useReducer(ModelReducer, initialState)

	// Get Model Data
	const getModelData = messageData => {
		setLoading()

		dispatch({
			type: GET_MODEL_DATA,
			payload: messageData,
		})
	}

	// Get Workstations from the API
	const getModelWks = wks => {
		setLoading()

		dispatch({
			type: GET_MODEL_WKS,
			payload: wks,
		})
	}

	// Set Loading
	const setLoading = () => dispatch({ type: SET_LOADING })

	return (
		<ModelContext.Provider
			value={{
				data: state.data,
				wks: state.wks,
				loading: state.loading,
				getModelData,
				getModelWks,
			}}
		>
			{props.children}
		</ModelContext.Provider>
	)
}

export default ModelState
