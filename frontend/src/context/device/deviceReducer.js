import {
	GET_DEVICE_WKS,
	SET_DEVICE_MAP,
	SET_CURRENT_DEVICE,
	GET_DEVICE_WEBSOCKET_STATUS,
} from '../types'

export default (state, action) => {
	switch (action.type) {
		case GET_DEVICE_WKS:
			return {
				...state,
				wks: action.payload,
			}

		case GET_DEVICE_WEBSOCKET_STATUS:
			return {
				...state,
				websocketStatus: action.payload,
			}

		case SET_CURRENT_DEVICE:
			return {
				...state,
				currentDevice: action.payload,
			}

		case SET_DEVICE_MAP:
			return {
				...state,
				wksMap: action.payload,
			}

		default:
			return state
	}
}
