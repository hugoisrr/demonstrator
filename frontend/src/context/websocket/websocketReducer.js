import {
	OPEN_WEBSOCKET_MODEL,
	OPEN_WEBSOCKET_DEVICE,
	OPEN_WEBSOCKET_LABEL,
} from '../types'

export default (state, action) => {
	switch (action.type) {
		case OPEN_WEBSOCKET_MODEL:
			return {
				...state,
				open: (state.modelWebsocket.open = true),
			}

		case OPEN_WEBSOCKET_LABEL:
			return {
				...state,
				open: (state.labelerWebsocket.open = true),
			}

		case OPEN_WEBSOCKET_DEVICE:
			return {
				...state,
				open: (state.deviceWebsocket.open = true),
			}

		default:
			return state
	}
}
