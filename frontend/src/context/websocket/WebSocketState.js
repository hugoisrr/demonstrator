import React, { useReducer } from 'react'
import WebsocketContext from './websocketContext'
import WebsocketReducer from './websocketReducer'
import {
	OPEN_WEBSOCKET_MODEL,
	OPEN_WEBSOCKET_LABEL,
	OPEN_WEBSOCKET_DEVICE,
} from '../types'

const WebSocketState = props => {
	const initialState = {
		modelWebsocket: {
			open: false,
		},
		labelerWebsocket: {
			open: false,
		},
		deviceWebsocket: {
			open: false,
		},
	}

	const [state, dispatch] = useReducer(WebsocketReducer, initialState)

	const websocketModelOpen = () => dispatch({ type: OPEN_WEBSOCKET_MODEL })

	const websocketLabelOpen = () => dispatch({ type: OPEN_WEBSOCKET_LABEL })

	const websocketDeviceOpen = () => dispatch({ type: OPEN_WEBSOCKET_DEVICE })

	return (
		<WebsocketContext.Provider
			value={{
				modelWebsocket: state.modelWebsocket,
				websocketModelOpen,
				labelerWebsocket: state.labelerWebsocket,
				websocketLabelOpen,
				deviceWebsocket: state.deviceWebsocket,
				websocketDeviceOpen,
			}}
		>
			{props.children}
		</WebsocketContext.Provider>
	)
}

export default WebSocketState
