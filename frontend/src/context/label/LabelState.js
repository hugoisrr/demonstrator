import React, { useReducer } from 'react'

import LabelContext from './labelContext'
import LabelReducer from './labelReducer'
import { GET_LABEL_DATA, GET_LABELER_WKS } from '../types'

const LabelState = props => {
	const initialState = {
		data: {},
		wks: [],
	}

	const [state, dispatch] = useReducer(LabelReducer, initialState)

	// Get Label Data
	const getLabelData = messageData => {
		dispatch({
			type: GET_LABEL_DATA,
			payload: messageData,
		})
	}

	// Get List of Workstations
	const getLabelWks = wks => {
		dispatch({
			type: GET_LABELER_WKS,
			payload: wks,
		})
	}

	return (
		<LabelContext.Provider
			value={{
				data: state.data,
				wks: state.wks,
				getLabelData,
				getLabelWks,
			}}
		>
			{props.children}
		</LabelContext.Provider>
	)
}

export default LabelState
