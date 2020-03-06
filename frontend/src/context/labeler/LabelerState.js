import React, { useReducer } from 'react'

import LabelerContext from './labelerContext'
import LabelerReducer from './labelerReducer'
import { GET_LABELER_DATA, GET_LABELER_WKS } from '../types'

const LabelerState = props => {
	const initialState = {
		data: {},
		wks: [],
	}

	const [state, dispatch] = useReducer(LabelerReducer, initialState)

	// Get Labeler Data
	const getLabelerData = messageData => {
		dispatch({
			type: GET_LABELER_DATA,
			payload: messageData,
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
				getLabelerData,
				getLabelerWks,
			}}
		>
			{props.children}
		</LabelerContext.Provider>
	)
}

export default LabelerState
