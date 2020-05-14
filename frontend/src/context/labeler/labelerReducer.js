import {
	GET_LABELER_WKS,
	SET_LABELER_MAP,
	SET_LABELER_COLORS,
	SET_LABELER_FLEX_VALUES,
	GET_LABELER_WEBSOCKET_STATUS,
} from '../types'

export default (state, action) => {
	switch (action.type) {
		case SET_LABELER_MAP:
			return {
				...state,
				wksMap: action.payload,
			}

		case SET_LABELER_FLEX_VALUES:
			return {
				...state,
				flexValues: action.payload,
			}

		case SET_LABELER_COLORS:
			return {
				...state,
				wksStatesColors: action.payload,
			}

		case GET_LABELER_WKS:
			return {
				...state,
				wks: action.payload,
			}

		case GET_LABELER_WEBSOCKET_STATUS:
			return {
				...state,
				websocketStatus: action.payload,
			}

		default:
			return state
	}
}
