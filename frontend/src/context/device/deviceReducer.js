import { GET_DEVICE_DATA, GET_DEVICE_WKS, GET_DICTIONARY_DATA } from '../types'
//Interface
export default (state, action) => {
	switch (action.type) {
		case GET_DEVICE_DATA:
			return {
				...state,
				data: action.payload,
			}
		/* case PUSH_DEVICE_DATA:
			return {
				 
			} */
		case GET_DICTIONARY_DATA:
			return {
				...state,
				dictionary2: action.payload,
			}

		case GET_DEVICE_WKS:
			return {
				...state,
				wks: action.payload,
			}

		default:
			return state
	}
}
