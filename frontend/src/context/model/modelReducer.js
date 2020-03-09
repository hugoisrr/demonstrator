import {
	GET_MODEL_DATA,
	GET_MODEL_WKS,
	GET_MODEL_WEBSOCKET_STATUS,
} from '../types'

export default (state, action) => {
	switch (action.type) {
		case GET_MODEL_DATA:
			return {
				...state,
				data: action.payload,
			}

		case GET_MODEL_WKS:
			return {
				...state,
				wks: action.payload,
			}

		case GET_MODEL_WEBSOCKET_STATUS:
			return {
				...state,
				websocketStatus: action.payload,
			}

		default:
			return state
	}
}
