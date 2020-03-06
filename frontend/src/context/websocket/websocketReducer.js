import { OPEN_WEBSOCKET_DEVICE, OPEN_WEBSOCKET_LABELER } from '../types'

//Change 'open' attribute of each websocket to true when each websocket triggers a 'onconnect' message
export default (state, action) => {
	switch (action.type) {
		case OPEN_WEBSOCKET_LABELER:
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
