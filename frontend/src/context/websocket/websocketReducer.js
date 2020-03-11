import { OPEN_WEBSOCKET_DEVICE } from '../types'

//Change 'open' attribute of each websocket to true when each websocket triggers a 'onconnect' message
export default (state, action) => {
	switch (action.type) {
		case OPEN_WEBSOCKET_DEVICE:
			return {
				...state,
				open: (state.deviceWebsocket.open = true),
			}

		default:
			return state
	}
}
