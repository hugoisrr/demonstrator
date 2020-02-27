import { OPEN_WEBSOCKET_MODEL } from '../types'

export default (state, action) => {
	switch (action.type) {
		case OPEN_WEBSOCKET_MODEL:
			return {
				...state,
				open: (state.modelWebsocket.open = true),
			}

		default:
			return state
	}
}
