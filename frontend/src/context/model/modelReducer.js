import { GET_MODEL_DATA, SET_LOADING, GET_MODEL_WKS } from '../types'

export default (state, action) => {
	switch (action.type) {
		case GET_MODEL_DATA:
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

		case GET_MODEL_WKS:
			return {
				...state,
				wks: action.payload,
				loading: false,
			}

		default:
			return state
	}
}
