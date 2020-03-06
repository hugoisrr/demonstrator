//Store status of the different websockets
import React, { useReducer } from 'react'
import WebsocketContext from './websocketContext'
import WebsocketReducer from './websocketReducer'
import { OPEN_WEBSOCKET_LABELER, OPEN_WEBSOCKET_DEVICE } from '../types'

const WebSocketState = props => {
	//store in state if each websocket is either open or closed
	const initialState = {
		labelerWebsocket: {
			open: false,
		},
		deviceWebsocket: {
			open: false,
		},
	}

	const [state, dispatch] = useReducer(WebsocketReducer, initialState)

	//Change 'open' attribute of each websocket to true when each websocket triggers a 'onconnect' message

	const websocketLabelerOpen = () => dispatch({ type: OPEN_WEBSOCKET_LABELER })

	const websocketDeviceOpen = () => dispatch({ type: OPEN_WEBSOCKET_DEVICE })

	return (
		<WebsocketContext.Provider
			value={{
				labelerWebsocket: state.labelerWebsocket,
				websocketLabelerOpen,
				deviceWebsocket: state.deviceWebsocket,
				websocketDeviceOpen,
			}}
		>
			{props.children}
		</WebsocketContext.Provider>
	)
}

export default WebSocketState
