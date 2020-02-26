import { GET_LABEL_DATA, SET_LOADING, GET_LABELER_WKS } from '../types'

export default (state, action) => {
	switch (action.type) {
		case GET_LABEL_DATA:
			return {
				...state,
				data: action.payload,
				loading: false,
			}

		case SET_LOADING:
			return {
				...state,
				loading: true,
			}

		case GET_LABELER_WKS:
			return {
				...state,
				wks: action.payload,
				loading: false,
			}

		default:
			return state
	}
}
