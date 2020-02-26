import { GET_DEVICE_DATA, SET_LOADING, GET_DEVICE_WKS } from '../types'

export default (state, action) => {
	switch (action.type) {
		case GET_DEVICE_DATA:
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

		case GET_DEVICE_WKS:
			return {
				...state,
				wks: action.payload,
				loading: false,
			}

		default:
			return state
	}
}
