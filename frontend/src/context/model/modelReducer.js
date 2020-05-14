import {
	GET_MODEL_WKS,
	SET_MODEL_MAP,
	SET_MODEL_COLORS,
	SET_MODEL_FLEX_VALUES,
	GET_MODEL_WEBSOCKET_STATUS,
} from '../types'

export default (state, action) => {
	switch (action.type) {
		case SET_MODEL_MAP:
			return {
				...state,
				wksMap: action.payload,
			}

		case SET_MODEL_FLEX_VALUES:
			return {
				...state,
				flexValues: action.payload,
			}

		case SET_MODEL_COLORS:
			return {
				...state,
				wksStatesColors: action.payload,
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
