import { GET_LABEL_DATA, SET_LOADING } from '../types'

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

		default:
			return state
	}
}
