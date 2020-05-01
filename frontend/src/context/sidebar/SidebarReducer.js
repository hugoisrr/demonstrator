import {
	GET_WKS_IDS_SIDEBAR,
	SET_WKS_IDS_MAP_SIDEBAR,
	REMOVE_DUPLICATED_IDS_SIDEBAR,
} from '../types'

export default (state, action) => {
	switch (action.type) {
		case GET_WKS_IDS_SIDEBAR:
			return {
				...state,
				wksId: [action.payload, ...state.wksId],
			}

		case REMOVE_DUPLICATED_IDS_SIDEBAR:
			return {
				...state,
				wksId: action.payload.filter((a, b) => action.payload.indexOf(a) === b),
			}

		case SET_WKS_IDS_MAP_SIDEBAR:
			return {
				...state,
				wksIdsMap: action.payload,
			}

		default:
			return state
	}
}
