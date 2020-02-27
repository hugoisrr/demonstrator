import React, { useReducer } from 'react'
import WebsocketContext from './websocketContext'
import WebsocketReducer from './websocketReducer'
import { OPEN_WEBSOCKET_MODEL } from '../types'

const WebSocketState = props => {
	const initialState = {
		modelWebsocket: {
			open: false,
		},
	}

	const [state, dispatch] = useReducer(WebsocketReducer, initialState)

	const websocketModelOpen = () => dispatch({ type: OPEN_WEBSOCKET_MODEL })

	return (
		<WebsocketContext.Provider
			value={{
				modelWebsocket: state.modelWebsocket,
				websocketModelOpen,
			}}
		>
			{props.children}
		</WebsocketContext.Provider>
	)
}

export default WebSocketState
