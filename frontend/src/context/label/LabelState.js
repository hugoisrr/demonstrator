import React, { useReducer } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import LabelContext from './labelContext'
import LabelReducer from './labelReducer'
import { GET_LABEL_DATA, SET_LOADING } from '../types'

const client = new W3CWebSocket('ws://localhost:2000')

const LabelState = props => {
	const initialState = {
		data: [],
		loading: false,
	}

	const [state, dispatch] = useReducer(LabelReducer, initialState)

	// Get Label Data
	const getLabelData = () => {
		setLoading()

		client.onopen = () => {
			console.log('WebSocket Client Connected')
		}

		client.onmessage = message => {
			dispatch({
				type: GET_LABEL_DATA,
				payload: message.data,
			})
		}
	}

	// Set Loading
	const setLoading = () => dispatch({ type: SET_LOADING })

	return (
		<LabelContext.Provider
			value={{
				data: state.data,
				loading: state.loading,
				getLabelData,
			}}
		>
			{props.children}
		</LabelContext.Provider>
	)
}

export default LabelState
