import React, { useReducer } from 'react'

import LabelContext from './labelContext'
import LabelReducer from './labelReducer'
import { GET_LABEL_DATA, SET_LOADING, GET_LABELER_WKS } from '../types'

const LabelState = props => {
	const initialState = {
		data: {},
		wks: [],
		loading: false,
	}

	const [state, dispatch] = useReducer(LabelReducer, initialState)

	// Get Label Data
	const getLabelData = messageData => {
		setLoading()

		dispatch({
			type: GET_LABEL_DATA,
			payload: messageData,
		})
	}

	// Get List of Workstations
	const getLabelWks = wks => {
		setLoading()
		dispatch({
			type: GET_LABELER_WKS,
			payload: wks,
		})
	}

	// Set Loading
	const setLoading = () => dispatch({ type: SET_LOADING })

	return (
		<LabelContext.Provider
			value={{
				data: state.data,
				wks: state.wks,
				loading: state.loading,
				getLabelData,
				getLabelWks,
			}}
		>
			{props.children}
		</LabelContext.Provider>
	)
}

export default LabelState
